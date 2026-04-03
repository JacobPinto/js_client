/**
 * gRPC Server implementation for client service.
 * Handles client creation requests using Protocol Buffers.
 */

import grpc from "@grpc/grpc-js"; 
import protoLoader from "@grpc/proto-loader"; 
import path from "path"; 
import { fileURLToPath } from "url";

// Get the current file's directory path for resolving relative paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the Protocol Buffer definition file
const protoPath = path.join(__dirname, "client.proto");

// Load the proto file with specified options
const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

// Load the gRPC package definition and extract the client package
const grpcObject: any = grpc.loadPackageDefinition(packageDef);
const clientPackage = grpcObject.client;

/**
 * Handler for creating a new client.
 * Logs the received client data and responds with a success message.
 * @param call - The gRPC call object containing the client request data
 * @param callback - The callback function to send the response
 */
function createClient(call: any, callback: any) {
  const { name, email } = call.request;

  console.log("[gRPC] Client received:", name, email);

  callback(null, {
    message: `Client ${name} created successfully`,
  });
}

/**
 * Starts the gRPC server, adds the client service, and binds it to a port.
 * The server listens for incoming client creation requests.
 */
export function startGrpcServer() {
  // Create a new gRPC server instance
  const server = new grpc.Server();

  // Add the ClientService with the CreateClient method handler
  server.addService(clientPackage.ClientService.service, {
    CreateClient: createClient,
  });

  // Bind the server to all interfaces on port 50051 with insecure credentials
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {

      if (err) {
        console.error("gRPC bind error:", err);
        return;
      }

      console.log(`gRPC server running on port ${port}`);
    }
  );
}