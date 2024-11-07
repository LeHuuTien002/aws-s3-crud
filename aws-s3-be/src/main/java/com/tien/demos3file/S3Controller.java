package com.tien.demos3file;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
public class S3Controller {

    private final S3Service s3Service;
    private final FileRepository fileRepository;

    public S3Controller(S3Service s3Service, FileRepository fileRepository) {
        this.s3Service = s3Service;
        this.fileRepository = fileRepository;
    }

    // Thêm hình ảnh
    @PostMapping("/upload")
    public FileEntity uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String url = s3Service.uploadFile(file);
        FileEntity fileEntity = new FileEntity();
        fileEntity.setName(file.getOriginalFilename());
        fileEntity.setUrl(url);
        return fileRepository.save(fileEntity);
    }

    // Đọc danh sách hình ảnh
    @GetMapping
    public List<FileEntity> listFiles() {
        return fileRepository.findAll();
    }

    // Xóa hình ảnh
    @DeleteMapping("/{id}")
    public void deleteFile(@PathVariable Long id) {
        FileEntity fileEntity = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        s3Service.deleteFile(fileEntity.getName());
        fileRepository.delete(fileEntity);
    }

    // Cập nhật hình ảnh
    @PutMapping("/{id}")
    public FileEntity updateFile(@PathVariable Long id, @RequestParam("file") MultipartFile newFile) throws IOException {
        FileEntity fileEntity = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        String newUrl = s3Service.updateFile(fileEntity.getName(), newFile);
        fileEntity.setName(newFile.getOriginalFilename());
        fileEntity.setUrl(newUrl);
        return fileRepository.save(fileEntity);
    }
}

