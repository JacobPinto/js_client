/**
 * gRPC Client for CameraService.
 * Used by Express camera router to send camera updates.
 */

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoPath = path.join(__dirname, "camera.proto");

const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject: any = grpc.loadPackageDefinition(packageDef);

const CameraService = grpcObject.camera.CameraService;

export const grpcClientCamera = new CameraService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);