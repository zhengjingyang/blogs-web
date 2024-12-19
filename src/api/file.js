import service from '@/libs/request';

export function uploadFile(data) {
  return service.post('/file/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }}
  );
}