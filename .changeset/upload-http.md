---
'@reef-ui/components': minor
---

Upload 新增 HTTP 上传：传 `action` 后经 XMLHttpRequest 上传，配套 `beforeUpload` / `onProgress` / `onSuccess` / `onError` / `headers` / `name` / `withCredentials`，导出 `UploadStatus` 类型。不传 `action` 时行为不变，仍只收集文件列表。
