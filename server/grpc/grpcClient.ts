import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const protoPath = path.join(__dirname, "client.proto");
const packageDef = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const grpcObject: any = grpc.loadPackageDefinition(packageDef);

const ClientService = grpcObject.client.ClientService;

const client = new ClientService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

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