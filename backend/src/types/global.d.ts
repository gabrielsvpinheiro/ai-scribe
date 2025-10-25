declare global {
  interface File {
    new (fileBits: BlobPart[], fileName: string, options?: FilePropertyBag): File;
  }
}

export {};
