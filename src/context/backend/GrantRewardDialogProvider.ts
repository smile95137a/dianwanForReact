import { useState } from 'react';

export const useGrantRewardDialog = () => {
  const [memberList, setMemberList] = useState<any[]>([]);
  const [grantRewardDialogOpen, setGrantRewardDialogOpen] = useState(false);
  const [addMemberResolve, setAddMemberResolve] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openGrantRewardDialog = (memberList: any[]): Promise<boolean> => {
    setMemberList(memberList);
    setGrantRewardDialogOpen(true);

    return new Promise((resolve) => {
      setAddMemberResolve(() => resolve);
    });
  };

  const closeGrantRewardDialog = (result: boolean) => {
    setMemberList([]);
    setGrantRewardDialogOpen(false);
    if (addMemberResolve) addMemberResolve(result);
  };

  const confirmGrantRewardDialog = () => {
    setGrantRewardDialogOpen(false);
    if (addMemberResolve) addMemberResolve(true);
  };

  return {
    memberList,
    grantRewardDialogOpen,
    openGrantRewardDialog,
    closeGrantRewardDialog,
    confirmGrantRewardDialog,
  };
};
