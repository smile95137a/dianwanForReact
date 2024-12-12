// import React, { useEffect, useState } from 'react';
// import BTable from '@/components/backend/btable/BTable';
// import BTableRow from '@/components/backend/btable/BTableRow';
// import NoData from '@/components/backend/NoData';
// import Pagination from '@/components/backend/Pagination';
// import Card from '@/components/frontend/MCard';
// import { usePagination } from '@/hooks/usePagination';
// import {
//   getAllRedemptionCodes,
//   generateRedemptionCode,
// } from '@/services/backend/RedemptionService';
// import DateFormatter from '@/components/common/DateFormatter';
// import { getAllProductsByType } from '@/services/backend/ProductService';
// import { useLoading } from '@/context/frontend/LoadingContext';
// import { getAllOrder } from '@/services/backend/orderService';

// const OrderManagement = () => {
//   const [orderList, setOrderList] = useState<any[]>([]);
//   const [filteredList, setFilteredList] = useState<any[]>([]);
//   const [filter, setFilter] = useState<
//     'ALL' | 'SHIPPED' | 'PREPARING_SHIPMENT' | 'NO_PAY'
//   >('ALL');

//   const pagination = usePagination({
//     list: filteredList,
//     pageLimitSize: 10,
//     initialPage: 1,
//   });

//   const { setLoading } = useLoading();

//   useEffect(() => {
//     fetchOrderList();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [filter, orderList]);

//   const fetchOrderList = async () => {
//     try {
//       setLoading(true);
//       const { success, data, message } = await getAllOrder();
//       setLoading(false);
//       if (success) {
//         setOrderList(data);
//       } else {
//         console.log(message);
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error('獲取商品列表失敗：', error);
//     }
//   };

//   const applyFilters = () => {
//     let updatedList = orderList;

//     if (filter !== 'ALL') {
//       updatedList = orderList.filter((order) => order.resultStatus === filter);
//     }
//     console.log(updatedList);

//     setFilteredList(updatedList);
//   };
//   return (
//     <div className="orderManagement">
//       <p className="orderManagement__title">訂單管理</p>

//       {/* Filter Buttons */}
//       <div className="orderManagement__filter gap-x-12">
//         <button
//           className={`orderManagement__filter-btn ${
//             filter === 'ALL' ? 'active' : ''
//           }`}
//           onClick={() => setFilter('ALL')}
//         >
//           全部訂單
//         </button>
//         <button
//           className={`orderManagement__filter-btn ${
//             filter === 'SHIPPED' ? 'active' : ''
//           }`}
//           onClick={() => setFilter('SHIPPED')}
//         >
//           已發貨
//         </button>
//         <button
//           className={`orderManagement__filter-btn ${
//             filter === 'PREPARING_SHIPMENT' ? 'active' : ''
//           }`}
//           onClick={() => setFilter('PREPARING_SHIPMENT')}
//         >
//           未發貨
//         </button>
//         <button
//           className={`orderManagement__filter-btn ${
//             filter === 'NO_PAY' ? 'active' : ''
//           }`}
//           onClick={() => setFilter('NO_PAY')}
//         >
//           未付款
//         </button>
//       </div>

//       <div className="orderManagement__list">
//         {filteredList.length > 0 ? (
//           <div className="orderManagement__list-content">
//             <BTable headers={[{ text: '訂單編號', className: '' }]}>
//               {pagination.currentPageItems.map((code, index) => (
//                 <BTableRow
//                   key={index}
//                   data={[
//                     { content: <>{code.orderNumber}</>, dataTitle: '訂單編號' },
//                   ]}
//                 />
//               ))}
//             </BTable>
//             <Pagination {...pagination} />
//           </div>
//         ) : (
//           <Card>
//             <NoData />
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderManagement;
import React from 'react';

const OrderManagement = () => {
  return <div>OrderManagement</div>;
};

export default OrderManagement;
