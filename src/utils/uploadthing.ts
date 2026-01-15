import { generateUploadButton } from "@uploadthing/react"
 
export interface ClientUploadRouter {
  accommodationIdProof: {
    input: undefined
    output: { fileUrl: string }
  }
  imageUploader: {
      input: undefined
      output: { fileUrl: string }
  }
}

export const UploadButton = generateUploadButton<ClientUploadRouter>();
