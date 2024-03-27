import { toast } from 'react-toastify';

export const currentData = (currentPage: number, ordersPerPage: number, data: any[] | undefined) => {
  const indexOfLastPost = currentPage * ordersPerPage;
  const indexOfFirstPost = indexOfLastPost - ordersPerPage;
  return data?.slice(indexOfFirstPost, indexOfLastPost);
};
export const ValidateForm = (name: string) => {
  if (!name) {
    toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
    return false;
  }
  return true;
};
