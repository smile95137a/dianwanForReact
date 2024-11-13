import BTable from '@/components/backend/btable/BTable';
import BTableRow from '@/components/backend/btable/BTableRow';
import BCard from '@/components/backend/MCard';
import NoData from '@/components/backend/NoData';
import Pagination from '@/components/backend/Pagination';
import DateFormatter from '@/components/common/DateFormatter';
import Card from '@/components/frontend/MCard';
import { useBackendDialog } from '@/context/backend/useBackendDialog';
import { usePagination } from '@/hooks/usePagination';
import { getAllUsers } from '@/services/backend/UserService';
import React, { useEffect, useState } from 'react';

const MemberManagement = () => {
  const { openAddMemberDialog } = useBackendDialog();

  const [users, setUsers] = useState<any[]>([]);

  const [statItems, setStatItems] = useState([
    { title: '會員總數', value: 0 },
    { title: '正式會員', value: 0 },
    { title: '體驗會員', value: 0 },
    { title: '當月新增', value: 0 },
  ]);

  const pagination = usePagination({
    list: users,
    pageLimitSize: 3,
    initialPage: 1,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { success, data } = await getAllUsers();
        if (success) {
          setUsers(data);
          updateStats();
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    updateStats();
  }, [users]);

  const updateStats = () => {
    const totalMembers = users.length;
    const regularMembers = users.filter((user) => user.roleId === 2).length;
    const trialMembers = users.filter((user) => user.roleId === 3).length;
    const newMembersThisMonth = users.filter((user) => {
      const createdDate = new Date(user.createdAt);
      const now = new Date();
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    }).length;

    setStatItems([
      { title: '會員總數', value: totalMembers },
      { title: '正式會員', value: regularMembers },
      { title: '體驗會員', value: trialMembers },
      { title: '當月新增', value: newMembersThisMonth },
    ]);
  };
  const roleOptions = [
    { value: 1, label: '權限控管管理者' },
    { value: 2, label: '一般管理者' },
    { value: 3, label: '驗證會員' },
    { value: 4, label: '未驗證會員' },
    { value: 5, label: '黑名單會員' },
  ];
  const getRoleName = (roleId: number) => {
    const role = roleOptions.find((option) => option.value === roleId);
    return role ? role.label : '未知角色';
  };

  const openMemberDialog = async () => {
    const result = await openAddMemberDialog();
    console.log(result);
  };

  const handleEditMember = (user: any) => async () => {
    const result = await openAddMemberDialog(true, user);
  };

  return (
    <div className="memberManagement">
      <p className="memberManagement__title">會員管理</p>
      <button
        className="memberManagement__addButton"
        onClick={openMemberDialog}
      >
        新增會員
      </button>
      <div className="flex gap-x-24">
        {statItems.map((item, index) => (
          <div key={index} className="w-25">
            <BCard
              content={
                <div className="memberManagement__info">
                  <p className="memberManagement__text memberManagement__text--title">
                    {item.title}
                  </p>
                  <p className="memberManagement__text">{item.value}</p>
                </div>
              }
            />
          </div>
        ))}
      </div>

      <div className="memberManagement__list">
        {users.length > 0 && (
          <div className="memberManagement__list-content">
            <BTable
              headers={[
                { text: '會員類型', className: '' },
                { text: '暱稱', className: '' },
                { text: '電話', className: '' },
                { text: '居住地址', className: '' },
                { text: '金幣', className: '' },
                { text: '銀幣', className: '' },
                { text: '紅利點數', className: '' },
                { text: '修改時間', className: '' },
                { text: '操作', className: '' },
              ]}
            >
              {pagination.currentPageItems.map((user, index) => (
                <BTableRow
                  key={index}
                  data={[
                    {
                      content: <>{getRoleName(user.roleId)}</>,
                      dataTitle: '會員類型',
                    },
                    { content: <>{user.nickName}</>, dataTitle: '暱稱' },
                    { content: <>{user.phoneNumber}</>, dataTitle: '電話' },
                    { content: <>{user.address}</>, dataTitle: '居住地址' },
                    { content: <>{user.balance}</>, dataTitle: '金幣' },
                    { content: <>{user.sliverCoin}</>, dataTitle: '銀幣' },
                    { content: <>{user.bonus}</>, dataTitle: '紅利點數' },
                    {
                      content: (
                        <>
                          <DateFormatter date={user.updatedAt} />
                        </>
                      ),
                      dataTitle: '修改時間',
                    },
                    {
                      content: (
                        <button
                          className="memberManagement__btn"
                          onClick={handleEditMember(user)}
                        >
                          編輯
                        </button>
                      ),
                      dataTitle: '操作',
                    },
                  ]}
                />
              ))}
            </BTable>
            <Pagination {...pagination} />
          </div>
        )}
        {users.length === 0 && <Card content={<NoData />} />}
      </div>
    </div>
  );
};

export default MemberManagement;
