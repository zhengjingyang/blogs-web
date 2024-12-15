import service from '@/libs/request';
// 获取文章类型列表
export function getArticleTypeList(data) {
  return service.post('/articleType/list', data);
}
// 创建文章类型
export function createArticleType(data) {
  return service.post('/articleType/add', data);
}
// 更新文章类型信息
export function updateArticleType(data) {
  return service.post('/articleType/update', data);
}
// 删除文章类型
export function deleteArticleType(id) {
  return service.get(`/articleType/delete?id=${id}`);
}
