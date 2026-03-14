import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoPath = path.join(__dirname, "client.proto");

const packageDef = protoLoader.loadSync(protoPath);

const grpcObject: any = grpc.loadPackageDefinition(packageDef);

const clientPackage = grpcObject.client;

function createClient(call: any, callback: any) {
  const { name, email } = call.request;

  console.log("[gRPC] Client received:", name, email);

  callback(null, {
    message: `Client ${name} created successfully`,
  });
}

export function startGrpcServer() {
  const server = new grpc.Server();

  server.addService(clientPackage.ClientService.service, {
    CreateClient: createClient,
  });

  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("gRPC server running on port 50051");
      server.start();
    }
  );
}