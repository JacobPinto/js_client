/**
 * gRPC Client example for client service.
 * Demonstrates how to connect to the gRPC server and create a client.
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

// Load the gRPC package definition
const grpcObject: any = grpc.loadPackageDefinition(packageDef);

// Extract the ClientService from the loaded package
const ClientService = grpcObject.client.ClientService;

// Create a new gRPC client instance connected to the server
const client = new ClientService(
  "localhost:50051",
  grpc.credentials.createInsecure() 
);

// Make a call to the CreateClient method
client.CreateClient(
  {
    name: "Muziba",
    email: "muziba@email.com",
  },
  (err: any, response: any) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log("Response:", response.message);
  }
);