/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import MaterialTable from '@material-table/core';
// import { ExportCsv, ExportPdf } from '@material-table/exporters'; // Import CSV/PDF Exporters
import AddBox from '@mui/icons-material/AddBox';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Check from '@mui/icons-material/Check';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Clear from '@mui/icons-material/Clear';
import FilterList from '@mui/icons-material/FilterList';
import FirstPage from '@mui/icons-material/FirstPage';
import LastPage from '@mui/icons-material/LastPage';
import Remove from '@mui/icons-material/Remove';
import Search from '@mui/icons-material/Search';
import ViewColumn from '@mui/icons-material/ViewColumn';
import Edit from '@mui/icons-material/Edit';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
};

function TableWrapper({ title, data, columns, options, ...props }) {
  return (
    <MaterialTable
      title={title}
      data={data}
      columns={columns}
      icons={tableIcons}
      options={{
        ...options,
        emptyRowsWhenPaging: false,
        pageSize: 10,
        pageSizeOptions: [5, 10, 20, 50, 100],
        headerStyle: {
          backgroundColor: '#F8F6F6',
          color: 'black',
          fontWeight: 'bold',
          zIndex: 0,
        },
        // exportMenu: [
        //   {
        //     label: 'Export Current Page as CSV',
        //     exportFunc: (cols, datas) => ExportCsv(cols, datas, title),
        //   },
        //   {
        //     label: 'Export All Data as CSV',
        //     exportFunc: (cols) => ExportCsv(cols, data, `${title}`), // Export all rows, use 'data' instead of 'datas'
        //   },
        //   {
        //     label: 'Export Current Page as PDF',
        //     exportFunc: (cols, datas) => ExportPdf(cols, datas, `${title}`),
        //   },
        //   {
        //     label: 'Export All Data as PDF',
        //     exportFunc: (cols) => ExportPdf(cols, data, `${title}`), // Export all rows, use 'data' instead of 'datas'
        //   },
        // ],
      }}
      {...props}
    />
  );
}

export default TableWrapper;
