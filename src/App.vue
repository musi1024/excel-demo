<template>
  <div id="app">
    <template class="excel-btn-group">
      <el-upload
        class="excel-upload"
        ref="upload"
        action="/"
        :show-file-list="false"
        :on-change="importExcel"
        :auto-upload="false"
      >
        <el-button slot="trigger" icon="el-icon-upload">上传列表</el-button>
      </el-upload>
      <el-button icon="el-icon-document" @click="exportExcel('订单统计')">导出</el-button>
      <el-button icon="el-icon-document" @click="handlerData">生成</el-button>
    </template>
    <el-table :data="tableData" id="out-table" style="width: 100%">
      <el-table-column
        v-for="item in tableTitle"
        :key="item"
        :prop="item"
        :label="item"
        width="90"
        align="center"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  name: "app",
  data() {
    return {
      tableData: [],
      tableTitle: [
        "条形码",
        "货号",
        "颜色",
        "220",
        "225",
        "230",
        "235",
        "240",
        "245",
        "250",
        "255"
      ]
    };
  },
  methods: {
    exportExcel(name) {
      //导出excelÎ
      let wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          name + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    importExcel(file, fileList) {
      // this.tableTitle = [];
      this.tableData = [];
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          let sheet = Object.keys(workbook.Sheets)[0];
          const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
            header: ["条形码"]
          });
          this.tableData = json;
          console.log(this.tableData);
        } catch (e) {
          console.log(e);
        }
      };
      fileReader.readAsBinaryString(file.raw);
    },
    handlerData() {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i]["货号"] = this.tableData[i]["条形码"].slice(0, 10);
        this.tableData[i]["颜色"] = this.tableData[i]["条形码"].slice(10, 14);
        let num = this.tableData[i]["条形码"].slice(14, 18);
        this.tableData[i][num] = "1";
      }
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.excel-upload {
  display: inline-block;
  margin-right: 10px;
}
.excel-btn-group {
  display: flex;
}
</style>
