/**
 * gRPC Server implementation for CameraService.
 * Receives camera updates from Express.
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

const cameraPackage = grpcObject.camera;

/**
 * Receives camera updates.
 */
function updateCamera(call: any, callback: any) {
  const {
    panX,
    panY,
    zoom,
    azimuth,
    elevation,
  } = call.request;

  console.log("\n[gRPC] Camera Update Received");

  console.log({
    panX,
    panY,
    zoom,
    azimuth,
    elevation,
  });

  callback(null, {
    message: "Camera updated successfully",
  });
}

/**
 * Starts gRPC server.
 */
export function startGrpcServerCamera() {
  const server = new grpc.Server();

  server.addService(
    cameraPackage.CameraService.service,
    {
      UpdateCamera: updateCamera,
    }
  );

  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("gRPC bind error:", err);
        return;
      }

      console.log(`gRPC server running on port ${port}`);

      server.start();
    }
  );
}