export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },

      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // 外部系统调用
  {
    path: '/openSystem',
    component: '../layouts/BlankLayout',
    routes: [
      // 异常差错
      {
        path: '/openSystem/abnormal/abnormalDetail/:id',
        name: 'abnormalDetail',
        component: './ErrAbnormal/AbnormalOpenDetail',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      //order
      {
        path: '/order',
        icon: 'bar-chart',
        name: 'Order',
        code: 'Order',
        sort: 7,
        routes: [
          // po采购计划
          {
            path: '/order/listWmsPo',
            name: 'Order.PO',
            code: 'PO_Management',
            component: './Order/WmsPo/WmsPoList',
          },
          {
            path: '/order/listWmsPo/addWmsPo',
            name: 'Order.PO Add',
            code: 'PO_Management',
            component: './Order/WmsPo/WmsPoOperate',
            hideInMenu: true,
          },
          {
            path: '/order/listWmsPo/editWmsPo/:id',
            name: 'Order.PO Detail',
            code: 'PO_Management',
            component: './Order/WmsPo/WmsPoOperate',
            hideInMenu: true,
          },
          // co出库计划
          {
            path: '/order/listWmsCo',
            name: 'Order.CO',
            code: 'CO_Management',
            component: './Order/WmsCo/WmsCoList',
          },
          {
            path: '/order/listWmsCo/addWmsCo',
            name: 'Order.CO Add',
            code: 'CO_Management',
            component: './Order/WmsCo/WmsCoOperate',
            hideInMenu: true,
          },
          {
            path: '/order/listWmsCo/editWmsCo/:id',
            name: 'Order.CO Detail',
            code: 'CO_Management',
            component: './Order/WmsCo/WmsCoOperate',
            hideInMenu: true,
          },
          {
            path: '/order/listWmsCo/reportWmsCo/:id',
            name: 'Order.COReport',
            code: 'CO_Management',
            component: './Order/WmsCo/WmsCoReport',
            hideInMenu: true,
          },
          //STO
          {
            path: '/order/sto/listSto',
            name: 'Order.STO',
            code: 'STO_Management',
            component: './Order/STO/STOList',
          },
          {
            path: '/order/sto/addSto',
            name: 'Order.STO Add',
            code: 'STO_Management',
            component: './Order/STO/STOOperate',
            hideInMenu: true,
          },
          {
            path: '/order/sto/editSto/:id',
            name: 'Order.STO Edit',
            code: 'STO_Management',
            component: './Order/STO/STOOperate',
            hideInMenu: true,
          },
        ]
      },
      //打印
      {
       path:'/print',
       name:'Print',
       code:'Inbound',
       hideInMenu:true,
       routes:[{
        path: '/print/:id/:type',
        name: 'Print.Print',
       hideInMenu:true,
        code: 'IBPlan_Management',
        component: './Print/Print',
       }]
      },
      // 收货管理inbound
      {
        path: '/inbound',
        icon: 'bar-chart',
        name: 'Inbound',
        code: 'Inbound',
        sort: 2,
        routes: [
          // IBPlan
          {
            path: '/inbound/listIBPlan',
            name: 'Inbound.IBPlan',
            code: 'IBPlan_Management',
            component: './Inbound/IBPlan/IBPlanList',
          },
          //ASN管理
          {
            path: '/inbound/listASN',
            name: 'Inbound.ASN',
            code: 'ASN_Management',
            component: './Inbound/ASN/ASNList',
          },
          {
            path: '/inbound/putawayTask/putawayTaskList/:id',
            name: 'Inbound.PuawayTask',
            hideInMenu: true,
            code: 'Picking_Management',
            component: './Inbound/PutawayTask/PutawayTaskList',
          },
          {
            path: '/inbound/detailsASN/:id',
            name: 'Inbound.ASNDetails',
            code: 'ASN_Management',
            hideInMenu: true,
            component: './Inbound/ASN/ASNDetails',
          },
          {
            path: '/inbound/deliveryDetails/:id',
            name: 'Inbound.DeliveryDetails',
            code: 'ASN_Management',
            hideInMenu: true,
            component: './Inbound/ASN/DeliveryDetails',
          },
          // 收货记录列表
          {
            path: '/inbound/receivingRecord',
            name: 'Inbound.ReceivingRecord',
            code: 'ReceiviingRecord_Management',
            component: './Inbound/ReceivingRecord/ReceivingRecord',
          },
          //移位单
          {
            path: '/inbound/putaway/putawayList',
            name: 'Inbound.Putaway',
            code: 'Putaway_Management',
            component: './Inbound/MoveDoc/MoveDocList'
          },
          {
            path: '/inbound/putaway/putawayEdit/:id&:move',
            name: 'Inbound.PAEdit',
            code: 'Putaway_Management',
            hideInMenu: true,
            component: './Inbound/MoveDoc/MoveDocDetailList'
          },

        ]
      },
      //outbound
      {
        path: '/outbound',
        name: 'Outbound',
        icon: 'rocket',
        code: 'Outbound',
        sort: 2.1,
        routes: [
          {
            path: '/outbound/OBNotice/listOBNotice',
            name: 'Outbound.OBNotice',
            code: 'OBNotice_Management',
            component: './Outbound/OBNotice/OBNoticeList',
          },
          {
            path: '/outbound/OBNotice/detailsOBNotice/:id',
            name: 'Outbound.OBNoticeDetails',
            code: 'OBNotice_Management',
            hideInMenu: true,
            component: './Outbound/OBNotice/OBNoticeDetails',
          },
          {
            path: '/outbound/OBNotice/detailInfo/:id',
            name: 'OBNoticeDetails',
            code: 'OBNotice_Management',
            hideInMenu: true,
            component: './Outbound/OBNotice/DetailInfo',
          },
          {
            path: '/outbound/picking/pickingList',
            name: 'Outbound.Picking',
            code: 'Picking_Management',
            component: './Outbound/Picking/PickingList',
          },
         
          {
            path: '/outbound/picking/pickingDetail/:id',
            name: 'Outbound.PickingDetail',
            code: 'Picking_Management',
            hideInMenu: true,
            component: './Outbound/Picking/PickingDetail',
          },
          {
            path: '/outbound/pickingTask/pickingTaskList/:id',
            name: 'Outbound.PickingTask',
            hideInMenu: true,
            code: 'Picking_Management',
            component: './Outbound/PickingTask/PickingTaskList',
          },
          {
            path: '/outbound/picking/pickingEdit/:id',
            name: 'Outbound.PickingEdit',
            code: 'Picking_Management',
            hideInMenu: true,
            component: './Outbound/Picking/PickingOperate',
          },
          {
            path: '/outbound/picking/print/:id',
            name: 'Outbound.PickingPrint',
            code: 'Picking_Management',
            hideInMenu: true,
            component: './Outbound/Picking/PickingPrint',
          },
          //出库单
          {
            path: '/outbound/delivery/listDelivery',
            name: 'Outbound.Delivery',
            code: 'Delivery_Management',
            component: './Outbound/Delivery/DeliveryList',
          },
          {
            path: '/outbound/delivery/editDelivery/:id',
            name: 'Outbound.DeliveryDetail',
            code: 'Delivery_Management',
            hideInMenu: true,
            component: './Outbound/Delivery/DeliveryOperate',
          },
          {
            path: '/outbound/delivery/print/:id',
            name: 'Outbound.DeliveryPrint',
            code: 'Picking_Management',
            hideInMenu: true,
            component: './Outbound/Delivery/DeliveryPrint',
          },
          //packing
          {
            path: '/outbound/packing/listPacking',
            name: 'Outbound.Packing',
            code: 'Packing_Management',
            component: './Outbound/Packing/PackingList',
          },
          {
            path: '/outbound/Packing/detailPacking/:id',
            name: 'Outbound.PackingDetail',
            code: 'Packing_Management',
            component: './Outbound/Packing/PackingDetail',
            hideInMenu: true,
          },
          //装车单
          {
            path: '/outbound/load/listLoad',
            name: 'Outbound.Loadlist',
            code: 'Load_Management',
            component: './Outbound/Load/LoadList',
          },
          {
            path: '/outbound/load/AddLoad',
            name: 'Outbound.LoadAdd',
            code: 'Load_Management',
            component: './Outbound/Load/LoadOperate',
            hideInMenu: true,
          },
          {
            path: '/outbound/load/editLoad/:id',
            name: 'Outbound.LoadlistDetail',
            code: 'Load_Management',
            component: './Outbound/Load/LoadOperate',
            hideInMenu: true,
          },
          
        ]

      },
      //operation
      {
        path: '/operation',
        name: 'Operation',
        icon: 'warning',
        code: 'Operation',
        sort: 3,
        routes: [
           //库存
           {
            path: '/operation/inventory/inventoryList',
            name: 'Operation.Inventory',
            code: 'Inventory_Management',
            component: './Operation/Inventory/InventoryList',
          },
          //库存 日志
          {
            path: '/operation/inventoryLog/inventoryLogList',
            name: 'Operation.InventoryLog',
            code: 'InventoryLog_Management',
            component: './Operation/InventoryLog/InventoryLogList',
          },

          //序列号
          {
            path: '/operation/serialNo/listSerialNo',
            name: 'Operation.SerialNo',
            code: 'SerialNo_Management',
            component: './Operation/SerialNo/SerialNo',
          },
          //OperationLog
          {
            path: '/operation/operationLog/operationLogList',
            name: 'Operation.OperationLog',
            code: 'MoveTaskLog_Management',
            component: './Operation/OperationLog/OperationLogList',
          },
          // 移动作业
          {
            path: '/operation/moveTask/moveTaskList',
            name: 'Operation.MoveTask',
            code: 'MoveTask_Management',
            component: './Operation/MoveTask/MoveTaskList',
          },
          //库存 日志
          {
            path: '/operation/moveTaskLog/moveTaskLogList',
            name: 'Operation.MoveTaskLog',
            code: 'MoveTaskLog_Management',
            component: './Operation/MoveTaskLog/MoveTaskLogList',
          },
         
          //Snapshot
          {
            path: '/operation/snapshot/listSnapshot',
            name: 'Operation.Snapshot',
            code: 'Snapshot_Management',
            component: './Operation/Snapshot/SnapshotList',
          },
          //Summary
          {
            path: '/operation/summary/listSummary',
            name: 'Operation.Summary',
            code: 'Summary_Management',
            component: './Operation/Summary/SummaryList',
          },
          // 盘点
          {
            path: '/operation/stockCount/listStockCount',
            name: 'Operation.StockCount',
            code: 'StockCount_Management',
            component: './Operation/StockCount/StockCountList',
          },
          {
            path: '/operation/stockCount/addStockCount',
            name: 'Operation.addStockCount',
            hideInMenu: true,
            code: 'StockCount_Management',
            component: './Operation/StockCount/StockCountOperate',
          },
          {
            path: '/operation/stockCount/editStockCount/:id',
            name: 'Operation.editStockCount',
            hideInMenu: true,
            code: 'StockCount_Management',
            component: './Operation/StockCount/StockCountOperate',
          },
          // Token
          {
            path: '/operation/Token/listToken',
            name: 'Operation.Token',
            code: 'Token_Management',
            component: './Operation/Token/TokenList',
          },
          {
            path: '/operation/Token/addToken',
            name: 'Operation.addToken',
            hideInMenu: true,
            code: 'Token_Management',
            component: './Operation/Token/TokenOperate',
          },
          {
            path: '/operation/Token/editToken/:id',
            name: 'Operation.editToken',
            hideInMenu: true,
            code: 'Token_Management',
            component: './Operation/Token/TokenOperate',
          },
        ]
      },
      // IQC\RMO
      {
        path: '/rms',
        icon: 'bars',
        name: 'RMS',
        code: 'RMS',
        sort: 2,
        routes: [
          // 质检单 
          {
            path: '/rms/iqc/iqclist',
            name: 'RMS.IQC',
            code: 'IQC_Management',
            component: './RMS/IQC/IQCList',
          },
          {
            path: '/rms/iqc/iqcTask/:id',
            name: 'RMS.IQCTask',
            hideInMenu: true,
            code: 'IQC_Management',
            component: './RMS/IQC/IQCTask',
          },
          {
            path: '/rms/iqc/detailIQC/:id',
            name: 'RMS.IQC.IQCDetails',
            code: 'IQC_Management',
            component: './RMS/IQC/IQCDetails',
            hideInMenu: true
          },
          // RMO
          {
            path: '/rms/rmo/listRmo',
            name: 'RMS.RMO',
            code: 'RMO_Management',
            component: './RMS/RMO/RMOList',
          },
          {
            path: '/rms/rmo/detailRmo/:id',
            name: 'RMS.RMODetails',
            code: 'RMO_Management',
            component: './RMS/RMO/RMODetails',
            hideInMenu: true
          },

        ]
      },
      // TMS
      {
        path: '/tms',
        icon: 'bars',
        name: 'TMS',
        code: 'TMS',
        sort: 2,
        routes: [
          {
            path: '/tms/trackOrder/listTrackOrder',
            name: 'TMS.TrackOrder',
            code: 'TMS_TrackOrder_Management',
            component: './TMS/TrackOrder/TrackOrderList',
          },
          {
            path: '/tms/trackOrder/detailsTrackOrder/:id',
            name: 'TMS.TrackOrderOperate',
            code: 'TMS_TrackOrderOperate_Management',
            component: './TMS/TrackOrder/TrackOrderOperate',
          },
        ]
      },
      //OperatingReport
      {
        path: '/operatingReport',
        name: 'OperatingReport',
        icon: 'folder-add',
        code: 'OperatingReport',
        sort: 6,
        routes: [
          {
            path: '/operatingReport/listOPInventoryReport',
            name: 'OperatingReport.Inventory',
            code: 'OPInventoryReport_Management',
            component: './OperatingReport/Inventory/Inventory',
          },
        ]
      },
      //报表
      {
        path: '/report',
        name: 'Report',
        icon: 'rocket',
        code: 'Report',
        sort: 4,
        routes: [
          {
            path: '/report/STOReport',
            name: 'Report.STOReport',
            code: 'STOReport_Management',
            component: './report/STOReport/STOReport',
          },
          {
            path: '/report/APRHReport',
            name: 'Report.APRHReport',
            code: 'APRHReport_Management',
            component: './report/APRHReport/APRHReport',
          },
          {
            path: '/report/listInventoryReport',
            name: 'Report.Inventory Report',
            code: 'InventoryReport_Management',
            component: './report/InventoryReport/InventoryReport',
          },
          // {
          //   path: '/report/listCoReport',
          //   name: 'Report.CoReport',
          //   code: 'CoReport_Management',
          //   component: './report/CoReport/CoReportList'
          // },
          {
            path: '/report/listCoReport',
            name: 'Report.Consumption Report',
            code: 'CoReport_Management',
            component: './report/CoReport/CoReport'
          },
          {
            path: '/report/listSellOut',
            name: 'Report.SellOut',
            code: 'SellOut_Management',
            component: './report/SellOut/SellOut'
          },
          {
            path: '/report/listPoReport',
            name: 'Report.Replenishment Report',
            code: 'PoReport_Management',
            component: './report/PoReport/PoReport'
          },
          {
            path: '/report/listBillingCoReport',
            name: 'Report.Parts Billing Report',
            code: 'BillingCoReport_Management',
            component: './Report/BillingCoReport/BillingCoReport'
          },
          {
            path: '/report/listReverseReport',
            name: 'Report.Reverse Report',
            code: 'ReverseReport_Management',
            component: './Report/ReverseReport/ReverseReport'
          },
          {
            path: '/report/listBillingMovement',
            name: 'Report.Inventory Movement Report',
            code: 'BillingMovement_Management',
            component: './Report/BillingMovement/BillingMovement'
          },
        ]
      },
      //结算 billing
      {
        path: '/billing',
        name: 'Billing',
        icon: 'pay-circle-o',
        code: 'Billing',
        sort: 5,
        routes: [
          //BuyLedger
          {
            path: '/billing/buyLedger/listBuyLedger',
            name: 'Billing.Parts Buy Ledger',
            code: 'BuyLedger_Management',
            component: './Billing/BuyLedger/BuyLedgerList',
          },
          {
            path: '/billing/buyLedger/createBilling/:id',
            name: 'Billing Detail',
            code: 'BuyLedger_Management',
            hideInMenu:true,
            component: './Billing/BuyLedger/CreateBilling',
          },
          //BuyBilling
          {
            path: '/billing/buyBilling/listBuyBilling',
            name: 'Billing.Parts Buy Billing',
            code: 'BuyBilling_Management',
            component: './Billing/BuyBilling/BuyBillingList',
          },
          //SellLedger
          {
            path: '/billing/sellLedger/listSellLedger',
            name: 'Billing.Parts Sell Ledger',
            code: 'SellLedger_Management',
            component: './Billing/SellLedger/SellLedgerList',
          },
          {
            path: '/billing/sellLedger/createBilling/:id',
            name: 'Billing Detail',
            code: 'SellLedger_Management',
            hideInMenu:true,
            component: './Billing/SellLedger/CreateBilling',
          },
          //SellBilling
          {
            path: '/billing/sellBilling/listSellBilling',
            name: 'Billing.Parts Sell Billing',
            code: 'SellBilling_Management',
            component: './Billing/SellBilling/SellBillingList',
          },
          //LogisticsLedger
          {
            path: '/billing/logisticsLedger/listLogisticsLedger',
            name: 'Billing.Logistics Ledger',
            code: 'LogisticsLedger_Management',
            component: './Billing/LogisticsLedger/LogisticsLedgerList',
          },
          {
            path: '/billing/logisticsLedger/createBilling/:id',
            name: 'Billing Detail',
            code: 'LogisticsLedger_Management',
            hideInMenu:true,
            component: './Billing/LogisticsLedger/CreateBilling',
          },
          //LogisticsBilling
          {
            path: '/billing/logisticsBilling/listLogisticsBilling',
            name: 'Billing.Logistics Billing',
            code: 'LogisticsBilling_Management',
            component: './Billing/LogisticsBilling/LogisticsBillingList',
          },

          //Receipt 
          {
            path: '/billing/receipt/listReceipt',
            name: 'Billing.Receipt',
            code: 'Receipt_Management',
            component: './Billing/Receipt/ReceiptList',
          },
          
          //ChargeDetail
          // {
          //   path: '/billing/chargeDetail/listChargeDetail',
          //   name: 'Billing.ChargeDetail',
          //   code: 'ChargeDetail_Management',
          //   component: './Billing/ChargeDetail/ChargeDetailList',
          // },
          {
            path: '/billing/chargeDetail/addChargeDetail',
            name: 'Billing.ChargeDetailAdd',
            code: 'ChargeDetail_Management',
            hideInMenu: true,
            component: './Billing/ChargeDetail/ChargeDetailOperate',
          },
          // {
          //   path: '/billing/chargeDetail/editChargeDetail/:id',
          //   name: 'Billing.ChargeDetailEdit',
          //   code: 'ChargeDetail_Management',
          //   hideInMenu: true,
          //   component: './Billing/ChargeDetail/ChargeDetailOperate',
          // },
          //billingLog
          {
            path: './billing/billingLog/listBillingLog',
            name: 'Billing.BillingLog',
            code: 'BillingLog_Menagement',
            component: './Billing/BillingLog/BillingLogList'
          },
          {
            path: '/billing/billingLog/detailsBillingLog/:id',
            name: 'Billing.BillingLogDetails',
            hideInMenu: true,
            code: 'BillingLog_Menagement',
            component: './Billing/BillingLog/BillingLogDetails'
          },
        ]
      },

      //接口管理：
      {
        path: '/interface',
        icon: 'book',
        name: 'InterFace',
        code: 'InterFace',
        sort: 6,
        routes: [
          //Task
          {
            path: '/interface/interfaceList',
            name: 'InterFace.Task',
            code: 'Content_Management',
            component: './Interface/InterfaceContent/InterfaceContentList',
          },
          {
            path: '/interface/interfaeContent/ContentEdit/:id',
            name: 'InterFace.ContentEdit',
            hideInMenu: true,
            code: 'Content_Management',
            component: './Interface/InterfaceContent/ContentOperate',
          },
          //Type
          {
            path: '/interface/interfaeType',
            name: 'InterFace.Type',
            code: 'Type_Management',
            component: './Interface/InterfaceType/InterfaceTypeList',
          },
          {
            path: '/interface/interfaeType/typeAdd',
            name: 'InterFace.TypeAdd',
            hideInMenu: true,
            code: 'Type_Management',
            component: './Interface/InterfaceType/TypeOperate',
          },
          {
            path: '/interface/interfaeType/typeEdit/:id',
            name: 'InterFace.TypeEdit',
            hideInMenu: true,
            code: 'Type_Management',
            component: './Interface/InterfaceType/TypeOperate',
          },
          //blockQueue
          {
            path: '/interface/blockqueue/listBlockqueue',
            name: 'InterFace.BlockQueue',
            code: 'Blockqueue_Management',
            component: './Interface/BlockingQueue/BlockingQueueList',
          },

        ],
      },
      //规则管理：
      {
        //规则维护
        path: '/rules',
        icon: 'snippets',
        name: 'Rules',
        code: 'RuleEngine',
        sort: 7,
        routes: [

          //动态数据源
          {
            path: '/rules/ruleMannage/dynamicDataList',
            name: 'Rules.DynamicData',
            code: 'DBDefine_Management',
            component: './RuleMannage/DynamicData/DynamicDataList',
          },
          {
            path: '/rules/ruleMannage/dynamicDataList/dynamicDataEdit/:id',
            name: 'Rules.DynamicDataEdit',
            component: './RuleMannage/DynamicData/DynamicDataOperate',
            hideInMenu: true,
          },
          {
            path: '/rules/ruleMannage/dynamicDataList/dynamicDataAdd',
            name: 'Rules.DynamicDataAdd',
            component: './RuleMannage/DynamicData/DynamicDataOperate',
            hideInMenu: true,
          },
          //  动态表管理
          {
            path: '/rules/ruleMannage/dynamicTableList',
            name: 'Rules.DynamicTable',
            code: 'TableDesign_Management',
            component: './RuleMannage/DynamicTable/DynamicTableList',
          },
          {
            path: '/rules/ruleMannage/dynamicTableList/dynamicTableEdit/:id',
            name: 'Rules.DynamicTableEdit',
            component: './RuleMannage/DynamicTable/DynamicTableOperate',
            hideInMenu: true,
          },
          {
            path: '/rules/ruleMannage/dynamicTableList/dynamicTableAdd',
            name: 'Rules.DynamicTableAdd',
            component: './RuleMannage/DynamicTable/DynamicTableOperate',
            hideInMenu: true,
          },

          {
            // path: '/rules/ruleMannage/dynamicTableList/dynamicTableData/:name',
            path: '/rules/ruleMannage/dynamicTableList/dynamicTableData',
            name: 'Rules.DynamicTableDetails',
            component: './RuleMannage/DynamicTable/DynamicTableData',
            hideInMenu: true,
          },
          //业务规则维护
          {
            path: '/rules/ruleMannage/RulesList',
            name: 'Rules.Business',
            code: 'RuleDesign_Management',
            component: './RuleMannage/BusinessRules/RulesList',
          },
          //  动态表版本管理
          {
            path: '/rules/ruleMannage/dynamicTableListVersions',
            name: 'Rules.DynamicTableVersions',
            code: 'DynamicTableVersions_Management',
            component: './RuleMannage/DynamicTableVersions/DynamicTableVersionsList',
          },
          {
            path: '/rules/ruleMannage/dynamicTableVersionsList/dynamicTableVersionsEdit/:id',
            name: 'Rules.DynamicTableVersionsEdit',
            component: './RuleMannage/DynamicTableVersions/DynamicTableVersionsOperate',
            hideInMenu: true,
          },
          {
            path: '/rules/ruleMannage/dynamicTableVersionsList/dynamicTableVersionsAdd',
            name: 'Rules.DynamicTableVersionsAdd',
            component: './RuleMannage/DynamicTableVersions/DynamicTableVersionsOperate',
            hideInMenu: true,
          },
          {
            // path: '/rules/ruleMannage/dynamicTableVersionsList/dynamicTableVersionsData/:name',
            path: '/rules/ruleMannage/dynamicTableVersionsList/dynamicTableVersionsData',
            name: 'Rules.DynamicTableVersionsDetails',
            component: './RuleMannage/DynamicTableVersions/DynamicTableVersionsData',
            hideInMenu: true,
          },
        ],
      },
      //基础数据管理
      {
        path: '/basicData',
        icon: 'bar-chart',
        name: 'BasicData',
        code: 'BasicData',
        sort: 5,

        routes: [
          //仓库管理
          {
            path: '/basicData/listWareHouse',
            name: 'BasicData.Warehouse',
            code: 'Warehouse_Management',
            component: './BasicData/WarehouseManage/WarehouseList',
          },
          {
            path: '/basicData/listWareHouse/addWareHouse',
            name: 'BasicData.WarehouseAdd',
            code: 'Warehouse_Management',
            component: './BasicData/WarehouseManage/WarehouseOperate',
            hideInMenu: true,
          },
          {
            path: '/basicData/listWareHouse/editWareHouse/:id',
            name: 'BasicData.WarehouseEdit',
            code: 'Warehouse_Management',
            component: './BasicData/WarehouseManage/WarehouseOperate',
            hideInMenu: true,
          },
          //仓库库区
          {
            path: '/basicData/listWareHouseArea',
            name: 'Area',
            code: 'Area_Management',
            component: './BasicData/WarehouseArea/WarehouseAreaList',
          },
          {
            path: '/basicData/listWareHouseArea/addWareHouseArea',
            name: 'BasicData.AreaAdd',
            code: 'Area_Management',
            component: './BasicData/WarehouseArea/WarehouseAreaOperate',
            hideInMenu: true,
          },
          {
            path: '/basicData/listWareHouseArea/editWareHouseArea/:id',
            name: 'BasicData.AreaEdit',
            code: 'Area_Management',
            component: './BasicData/WarehouseArea/WarehouseAreaOperate',
            hideInMenu: true,
          },
          //仓库库位
          {
            path: '/basicData/warehouseBin/warehouseBinList',
            name: 'Bin',
            code: 'Bin_Management',
            component: './BasicData/WarehouseBin/WarehouseBinList',
          },
          {
            path: '/basicData/warehouseBin/warehouseBinAdd',
            name: 'BasicData.BinAdd',
            code: 'Bin_Management',
            component: './BasicData/WarehouseBin/WarehouseBinOperate',
            hideInMenu: true,
          },
          {
            path: '/basicData/warehouseBin/warehouseBinEdit/:id',
            name: 'BasicData.BinEdit',
            code: 'Bin_Management',
            component: './BasicData/WarehouseBin/WarehouseBinOperate',
            hideInMenu: true,
          },

          //货品管理
          {
            path: '/basicData/listGoods',
            name: 'BasicData.PartData',
            code: 'PartData_Management',
            component: './BasicData/GoodsManage/GoodsList',
          },
          {
            path: '/basicData/listGoods/addGoods',
            name: 'BasicData.PartDataAdd',
            code: 'PartData_Management',
            component: './BasicData/GoodsManage/GoodsOperate',
            hideInMenu: true,
          },
          {
            path: '/basicData/listGoods/editGoods/:id',
            name: 'BasicData.PartDataEdit',
            code: 'PartData_Management',
            component: './BasicData/GoodsManage/GoodsOperate',
            hideInMenu: true,
          },
          //替代料关联
          {
            path: '/basicData/listItemRelation',
            name: 'BasicData.PartDataRelation',
            code: 'PartDataRelation_Management',
            component: './BasicData/ItemRelation/ItemRelationList',
          },
          {
            path: '/basicData/listItemRelation/addItemRelation',
            name: 'BasicData.PartDataRelationAdd',
            code: 'PartDataRelation_Management',
            component: './BasicData/ItemRelation/ItemRelationOperate',
            hideInMenu: true,
          },
          {
            path: '/basicData/listItemRelation/editItemRelation/:id',
            name: 'BasicData.PartDataRelationEdit',
            code: 'PartDataRelation_Management',
            component: './BasicData/ItemRelation/ItemRelationOperate',
            hideInMenu: true,
          },
          //替代料黑名单
          {
            path: '/basicData/listPartRelationException',
            name: 'BasicData.PartRelationException',
            code: 'PartRelationException_Management',
            component: './BasicData/PartRelationException/PartRelationExceptionList',
          },
          //料号黑名单
          {
            path: '/basicData/partException',
            name: 'BasicData.PartException',
            code: 'PartException_Management',
            component: './BasicData/PartException/PartExceptionList',
          },
          //国家管理
          {
            path: '/basicData/listCountry',
            name: 'BasicData.Country',
            code: 'Country_Management',
            component: './BasicData/CountryManage/CountryList',
          },
          {
            path: '/basicData/listCountry/addCountry',
            name: 'BasicData.CountryAdd',
            code: 'Country_Management',
            component: './BasicData/CountryManage/CountryOperate',
            hideInMenu: true,
          },
          {
            path: '/basicData/listCountry/editCountry/:id',
            name: 'BasicData.CountryEdit',
            code: 'Country_Management',
            component: './BasicData/CountryManage/CountryOperate',
            hideInMenu: true,
          },

          //单据流水号
          {
            path: '/basicData/listBillType',
            name: 'BasicData.BillType',
            code: 'BillType_Management',
            component: './BasicData/BillType/BillTypeList',
          },
          {
            path: '/basicData/listBillType/addBillType',
            name: 'BasicData.BillTypeAdd',
            code: 'BillType_Management',
            component: './BasicData/BillType/BillTypeOperate',
            hideInMenu: true,
          },
          {
            path: '/basicData/listBillType/editBillType/:id',
            name: 'BasicData.BillTypeEdit',
            code: 'BillType_Management',
            component: './BasicData/BillType/BillTypeOperate',
            hideInMenu: true,
          },
          //ChargeType
          {
            path: '/basicData/costType/listChargeType',
            name: 'Billing.ChargeType',
            code: 'BillType_Management',
            component: './BasicData/ChargeType/ChargeTypeList',
          },

          //货主信息
          {
            path: '/basicData/cargoOwner/cargoOwnerList',
            name: 'BasicData.CargoOwner',
            code: 'CargoOwner_Management',
            component: './BasicData/CargoOwner/CargoOwnerList',
          },
          {
            path: '/basicData/cargoOwner/cargoOwnerAdd',
            name: 'BasicData.CargoOwnerAdd',
            code: 'CargoOwner_Management',
            component: './BasicData/CargoOwner/CargoOwnerOperate',
            hideInMenu: true,
          },
          {
            path: '/basicData/cargoOwner/cargoOwnerEdit/:id',
            name: 'BasicData.CargoOwnerEdit',
            code: 'CargoOwner_Management',
            component: './BasicData/CargoOwner/CargoOwnerOperate',
            hideInMenu: true,
          },

          //uci
          {
            path: '/basicData/UCI/ListUCI',
            name: 'BasicData.UCI',
            code: 'UCI_Management',
            component: './BasicData/UCI/UCIList',
          },
          //承运商 forwarder
          {
            path: '/basicData/listForwarder',
            name: 'BasicData.Forwarder',
            code: 'Forwarder_Management',
            component: './BasicData/Forwarder/ForwarderList',

          },
          {
            path: '/basicData/listForwarder/addForwarder',
            name: 'BasicData.ForwarderAdd',
            code: 'Forwarder_Management',
            component: './BasicData/Forwarder/ForwarderOperate',
            hideInMenu: true,
          },
          {
            path: '/basicData/listForwarder/editForwarder/:id',
            name: 'BasicData.ForwarderEdit',
            code: 'Forwarder_Management',
            component: './BasicData/Forwarder/ForwarderOperate',
            hideInMenu: true,
          },
          //收发货人 contactUnit
          {
            path: '/basicData/listContactUnit',
            name: 'BasicData.ContactUnit',
            code: 'ContactUnit_Management',
            component: './BasicData/ContactUnit/ContactUnitList',

          },
          {
            path: '/basicData/listContactUnit/addContactUnit',
            name: 'BasicData.ContactUnitAdd',
            code: 'ContactUnit_Management',
            component: './BasicData/ContactUnit/ContactUnitOperate',
            hideInMenu: true,
          },
          {
            path: '/basicData/listContactUnit/editContactUnit/:id',
            name: 'BasicData.ContactUnitEdit',
            code: 'ContactUnit_Management',
            component: './BasicData/ContactUnit/ContactUnitOperate',
            hideInMenu: true,
          },
        ],
      },

      //系统管理：
      {
        path: '/system',
        icon: 'setting',
        name: 'System',
        code: 'SYSTEMMANA',
        sort: 1,

        routes: [
          //国际化语言
          // {
          //   path: '/system/LanguageList',
          //   name: 'LanguageList',
          //   code: 'LanguageList',
          //   component: './System/Language/LanguageList',
          // },
          //业务组织管理
          {
            path: '/system/OrgList',
            name: 'OrgList',
            code: 'ORGPAGE',
            component: './System/TmsOrg/OrgList',
          },
          {
            path: '/system/OrgList/edit-form/:id',
            name: 'OrgEdit',
            component: './System/TmsOrg/UpdateForm',
            hideInMenu: true,
          },
          {
            path: '/system/OrgList/add-form',
            name: 'OrgAdd',
            component: './System/TmsOrg/UpdateForm',
            hideInMenu: true,
          },
          //用户管理
          {
            path: '/system/AuthList',
            name: 'AuthList',
            code: 'USERPAGE',
            component: './System/TmsAuth/AuthList',
          },
          {
            path: '/system/AuthList/edit-form/:id',
            name: 'AuthEdit',
            component: './System/TmsAuth/UpdateForm',
            hideInMenu: true,
          },
          {
            path: '/system/AuthList/add-form',
            name: 'AuthAdd',
            component: './System/TmsAuth/UpdateForm',
            hideInMenu: true,
          },
          //修改密码
          {
            path: '/system/AuthList/passwd',
            name: 'Passwd',
            component: './User/UpdatePasswd',
            hideInMenu: true,
          },
          //角色管理
          {
            path: '/system/RoleList',
            name: 'RoleList',
            code: 'ROLEPAGE',
            component: './System/TmsRole/RoleList',
          },
          {
            path: '/system/RoleList/edit-form/:id',
            name: 'RoleEdit',
            component: './System/TmsRole/UpdateForm',
            hideInMenu: true,
          },
          {
            path: '/system/RoleList/add-form',
            name: 'RoleAdd',
            component: './System/TmsRole/UpdateForm',
            hideInMenu: true,
          },
          //菜单管理
          {
            path: '/system/MenuList',
            name: 'MenuList',
            code: 'MENUPAGE',
            component: './System/TmsMenu/MenuList',
          },
          {
            path: '/system/MenuList/edit-form/:id',
            name: 'MenuEdit',
            component: './System/TmsMenu/UpdateForm',
            hideInMenu: true,
          },
          {
            path: '/system/MenuList/add-form',
            name: 'MenuAdd',
            component: './System/TmsMenu/UpdateForm',
            hideInMenu: true,
          },
          //字典管理
          {
            path: '/system/dictList',
            name: 'DictList',
            code: 'DICTPAGE',
            component: './System/Dict/DictList',
          },
          {
            path: '/system/dictList/dictEdit/:id',
            name: 'DictEdit',
            component: './System/Dict/DictOperate',
            hideInMenu: true,
          },
          {
            path: '/system/dictList/dictAdd',
            name: 'DictAdd',
            component: './System/Dict/DictOperate',
            hideInMenu: true,
          },
          //数据字典管理
          {
            path: '/system/dictDataList',
            name: 'DictDataList',
            code: 'DICTDATAPAGE',
            component: './System/DictData/DictDataList',
          },

          // 系统配置管理
          {
            path: '/system/SysConfigList',
            name: 'SysConfigList',
            code: 'SYSCONFIGPAGE',
            component: './System/SysConfig/SysConfigList',
          },
          {
            path: '/system/SysConfigList/SysConfigEdit/:id',
            name: 'SysConfigEdit',
            component: './System/SysConfig/SysConfigOperate',
            hideInMenu: true,
          },
          {
            path: '/system/SysConfigList/SysConfigAdd',
            name: 'SysConfigAdd',
            component: './System/SysConfig/SysConfigOperate',
            hideInMenu: true,
          },
          //计划任务日志
          {
            path: '/system/listScheduledTaskLog',
            name: 'ScheduledTaskLogList',
            code: 'SYSCONFIGPAGE',
            component: './System/ScheduledTaskLog/ScheduledTaskLogList',
          },
          //定时任务
          {
            path: '/system/listCrontab',
            name: 'CrontabList',
            code: 'SYSCONFIGPAGE',
            component: './System/Crontab/CrontabList',
          },
          {
            path: '/system/Crontab/CrontabEdit/:id',
            name: 'SysConfigEdit',
            component: './System/Crontab/CrontabOperate',
            hideInMenu: true,
          },
          {
            path: '/system/Crontab/CrontabAdd',
            name: 'SysConfigAdd',
            component: './System/Crontab/CrontabOperate',
            hideInMenu: true,
          },
          //流水号管理
          {
            path: '/system/SequenceList',
            name: 'SequenceList',
            code: 'SEQUENCEPAGE',
            component: './System/SystemSetting/Sequence/SequenceList',
          },
          {
            path: '/system/SequenceList/SequenceEdit/:id',
            name: 'SequenceEdit',
            component: './System/SystemSetting/Sequence/SequenceOperate',
            hideInMenu: true,

          },

          {
            path: '/system/SequenceList/SequenceAdd',
            name: 'SequenceAdd',
            component: './System/SystemSetting/Sequence/SequenceOperate',
            hideInMenu: true,
          },
          //数据权限管理
          {
            path: '/system/DataAuthorityList',
            name: 'DataAuthorityList',
            code: 'DATAPERM',
            component: './System/SystemSetting/DataAuthority/DataAuthorityList',
          },
          {
            path: '/system/DataAuthorityList/DataAuthorityEdit/:id',
            name: 'DataAuthorityEdit',
            component: './System/SystemSetting/DataAuthority/DataAuthorityOperate',
            hideInMenu: true,
          },

          {
            path: '/system/DataAuthorityList/DataAuthorityAdd',
            name: 'DataAuthorityAdd',
            component: './System/SystemSetting/DataAuthority/DataAuthorityOperate',
            hideInMenu: true,
          },
           //bi报表配置
           {
            path: '/system/BiconfigList',
            name: 'BiconfigList',
            code: 'BICONFIG',
            component: './System/Biconfig/BiconfigList',
          },
          {
            path: '/system/Biconfig/BiconfigEdit/:id',
            name: 'BiconfigEdit',
            component: './System/Biconfig/BiconfigOperate',
            hideInMenu: true,
          },
          {
            path: '/system/Biconfig/BiconfigAdd',
            name: 'BiconfigAdd',
            component: './System/Biconfig/BiconfigOperate',
            hideInMenu: true,
          },
        ],
      },

      {
        component: '404',
      },
    ],
  },
];
