import { useState } from 'react';

export const useAddMemberDialog = () => {
  const [member, setMember] = useState<any>(null);
  const [isMemberEdit, setIsMemberEdit] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [addMemberResolve, setAddMemberResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAddMemberDialog = (
    isEdit = false,
    member = null
  ): Promise<boolean> => {
    setIsMemberEdit(isEdit);
    setMember(member);
    setAddMemberDialogOpen(true);

    return new Promise((resolve) => {
      setAddMemberResolve(() => resolve);
    });
  };

  const closeAddMemberDialog = (result: boolean) => {
    setIsMemberEdit(false);
    setMember(null);
    setAddMemberDialogOpen(false);
    if (addMemberResolve) addMemberResolve(result);
  };

  const confirmAddMemberDialog = () => {
    setAddMemberDialogOpen(false);
    if (addMemberResolve) addMemberResolve(true);
  };

  return {
    member,
    isMemberEdit,
    addMemberDialogOpen,
    openAddMemberDialog,
    closeAddMemberDialog,
    confirmAddMemberDialog,
  };
};
