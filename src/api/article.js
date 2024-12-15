import service from '@/libs/request';
// 获取文章列表
export function getArticleList(data) {
  return service.post('/article/list', data);
}
// 创建文章
export function createArticle(data) {
  return service.post('/article/add', data);
}
// 更新文章信息
export function updateArticle(data) {
  return service.post('/article/update', data);
}
// 删除文章
export function deleteArticle(id) {
  return service.get(`/article/delete?id=${id}`);
}