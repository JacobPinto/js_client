import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates a generic gRPC client for any proto/service.
 *
 * @param protoPath   - absolute path to the .proto file (use path.join(__dirname, "proto", "my.proto"))
 * @param servicePath - dot-separated path to the service in the proto package (e.g. "camera.CameraService")
 * @param address     - host:port of the gRPC server (e.g. "localhost:50051")
 *
 * Usage:
 *   const client = createGrpcClient(path.join(__dirname, "proto", "camera.proto"), "camera.CameraService", "localhost:50051");
 *   const response = await client.call("UpdateCamera", { panX: 1, panY: 0, zoom: 1, azimuth: 0, elevation: 0 });
 */
export function createGrpcClient(protoPath: string, servicePath: string, address: string) {

  const packageDef = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const grpcObject: any = grpc.loadPackageDefinition(packageDef);

  // Walk the dot-separated service path (e.g. "camera.CameraService")
  const ServiceClass = servicePath
    .split(".")
    .reduce((obj, key) => obj?.[key], grpcObject);

  if (!ServiceClass) {
    throw new Error(`gRPC service "${servicePath}" not found in ${protoPath}`);
  }

  const stub = new ServiceClass(address, grpc.credentials.createInsecure());

  return {
    /**
     * Calls a gRPC method by name and returns a Promise resolving to the response.
     */
    call(method: string, request: object): Promise<any> {
      return new Promise((resolve, reject) => {
        stub[method](request, (err: Error | null, response: any) => {
          if (err) reject(err);
          else resolve(response);
        });
      });
    },
  };
}
