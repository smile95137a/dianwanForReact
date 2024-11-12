import MemberCenterCoins from '@/components/frontend/memberCenter/MemberCenterCoins';
import ProfileEditForm from '@/components/frontend/memberCenter/ProfileEditForm';
import ProfileEditInvoiceForm from '@/components/frontend/memberCenter/ProfileEditInvoiceForm';
import React from 'react';

const ProfileEdit = () => {
  return (
    <>
      <MemberCenterCoins />
      <ProfileEditForm />
      <ProfileEditInvoiceForm />
    </>
  );
};

export default ProfileEdit;
