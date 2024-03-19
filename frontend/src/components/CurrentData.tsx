export const currentData = (currentPage: number, ordersPerPage: number, data: any[] | undefined) => {
  const indexOfLastPost = currentPage * ordersPerPage;
  const indexOfFirstPost = indexOfLastPost - ordersPerPage;
  return data?.slice(indexOfFirstPost, indexOfLastPost);
};
