<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单ID" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物流单号" prop="trackingNumber">
        <el-input
          v-model="queryParams.trackingNumber"
          placeholder="请输入物流单号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物流公司" prop="shippingCompany">
        <el-input
          v-model="queryParams.shippingCompany"
          placeholder="请输入物流公司"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发货时间" prop="shipDate">
        <el-date-picker clearable
          v-model="queryParams.shipDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择发货时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['shipment:shipment:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['shipment:shipment:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['shipment:shipment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['shipment:shipment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shipmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="发货ID" align="center" prop="shipmentId" />
      <el-table-column label="订单ID" align="center" prop="orderId" />
      <el-table-column label="物流单号" align="center" prop="trackingNumber" />
      <el-table-column label="物流公司" align="center" prop="shippingCompany" />
      <el-table-column label="物流状态" align="center" prop="status" />
      <el-table-column label="发货时间" align="center" prop="shipDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.shipDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['shipment:shipment:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['shipment:shipment:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改发货对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="shipmentRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单ID" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单ID" />
        </el-form-item>
        <el-form-item label="物流单号" prop="trackingNumber">
          <el-input v-model="form.trackingNumber" placeholder="请输入物流单号" />
        </el-form-item>
        <el-form-item label="物流公司" prop="shippingCompany">
          <el-input v-model="form.shippingCompany" placeholder="请输入物流公司" />
        </el-form-item>
        <el-form-item label="发货时间" prop="shipDate">
          <el-date-picker clearable
            v-model="form.shipDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发货时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Shipment">
import { listShipment, getShipment, delShipment, addShipment, updateShipment } from "@/api/shipment/shipment";

const { proxy } = getCurrentInstance();

const shipmentList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderId: null,
    trackingNumber: null,
    shippingCompany: null,
    status: null,
    shipDate: null
  },
  rules: {
    orderId: [
      { required: true, message: "订单ID不能为空", trigger: "blur" }
    ],
    trackingNumber: [
      { required: true, message: "物流单号不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询发货列表 */
function getList() {
  loading.value = true;
  listShipment(queryParams.value).then(response => {
    shipmentList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    shipmentId: null,
    orderId: null,
    trackingNumber: null,
    shippingCompany: null,
    status: null,
    shipDate: null
  };
  proxy.resetForm("shipmentRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.shipmentId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加发货";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _shipmentId = row.shipmentId || ids.value
  getShipment(_shipmentId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改发货";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["shipmentRef"].validate(valid => {
    if (valid) {
      if (form.value.shipmentId != null) {
        updateShipment(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addShipment(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _shipmentIds = row.shipmentId || ids.value;
  proxy.$modal.confirm('是否确认删除发货编号为"' + _shipmentIds + '"的数据项？').then(function() {
    return delShipment(_shipmentIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('shipment/shipment/export', {
    ...queryParams.value
  }, `shipment_${new Date().getTime()}.xlsx`)
}

getList();
</script>
