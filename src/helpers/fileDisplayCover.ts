const fileIcons: Record<string, string> = {
    zip: 'mdi-archive-outline',
    rar: 'mdi-archive-outline',
    doc: 'mdi-file-word-outline',
    docx: 'mdi-file-word-outline',
    pdf: 'mdi-file-pdf-box',
    jpg: 'mdi-file-image',
    jpeg: 'mdi-file-image',
    png: 'mdi-file-image',
    gif: 'mdi-file-image',
    mp4: 'mdi-multimedia',
    avi: 'mdi-multimedia',
    mov: 'mdi-multimedia',
    flac: 'mdi-multimedia',
    mp3: 'mdi-multimedia',
    wav: 'mdi-multimedia',
    xlsx: 'mdi-file-excel-outline',
    pptx: 'mdi-file-powerpoint-outline',
    xls: 'mdi-file-excel-outline',
    ppt: 'mdi-file-powerpoint-outline',
    odt: 'mdi-file-word-outline',
    ods: 'mdi-file-excel-outline',
};

export const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return fileIcons[extension || ''] || 'mdi-file-outline';
};