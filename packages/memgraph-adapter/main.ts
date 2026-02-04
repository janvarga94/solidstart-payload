import { trackMethods } from "./utils";
import {
  BaseDatabaseAdapter,
  Collection,
  createDatabaseAdapter,
  DatabaseAdapter,
  DatabaseAdapterObj,
  Payload,
  SelectType,
  PaginatedDocs,
} from "payload";
import db, { Driver } from "neo4j-driver";
import { v7 as uuidv7 } from "uuid";

// const session = driver.session();

// // @ts-ignore
// let implementation: DatabaseAdapter = {
//   init: () => {
//     driver = db.driver("bolt://localhost:7687");
//     return;
//   },
//   pay
// };
export interface Args {
  url: string;
}

declare module "payload" {
  export interface DatabaseAdapter
    extends Omit<BaseDatabaseAdapter, "sessions">,
      Omit<Args, "migrationDir"> {}
}

export type MemgraphAdapter = {
  driver: Driver;
} & BaseDatabaseAdapter;

export function memgraphAdapter({ url }: Args): DatabaseAdapterObj {
  function adapter({ payload }: { payload: Payload }) {
    let driver = db.driver(url);
    let sessions: { [id: string]: any } = {};
    return createDatabaseAdapter<MemgraphAdapter>({
      payload,
      driver: driver,
      // eslint-disable-next-line @typescript-eslint/require-await
      beginTransaction: async () => {
        throw new Error("unimplemented");
        const id = uuidv7();
        let session = driver.session();
        sessions![id] = session;
        await session.beginTransaction();
        return id;
      },
      commitTransaction: async (id) => {
        throw new Error("unimplemented");
        // // this if was coppied from mongodb adapter, not sure why it can be Promise
        // if (id instanceof Promise) {
        //   return;
        // }

        // if (!this.sessions[id]?.inTransaction()) {
        //   return;
        // }

        // await this.sessions[id].commitTransaction();
        // try {
        //   await this.sessions[id].endSession();
        // } catch (_) {
        //   // ending sessions is only best effort and won't impact anything if it fails since the transaction was committed
        // }
        // delete this.sessions[id];
      },
      count: async () => {
        throw new Error("Method not implemented.");
      },
      create: async () => {
        throw new Error("Method not implemented.");
      },
      find: async (what) => {
        // let page = what.page || 1; // pages start from 1 i i think
        let skip = what.skip || 0;
        let limit = what.limit;
        let orderByPart = Array.isArray(what.sort)
          ? what.sort.map((field) => "c." + field).join(",")
          : what.sort;
        what.where; // TODO
        what.select; // TODO
        let collection = what.collection;
        let session = driver.session();
        let result = await session.executeRead((tx) =>
          tx.run(
            `  
            MATCH (c:$collection) 
            RETURN ${
              what.select
                ? Object.keys(what.select)
                    .filter((f) => what.select![f])
                    .map((field) => "c." + field).join
                : payload.collections[what.collection].config.flattenedFields
                    .map((f) => "c." + f.name)
                    .join(",")
            }
            ${skip ? `SKIP $skip` : ""}
            ${limit ? `LIMIT $skip` : ""}
            ${orderByPart ? `ORDER BY ${orderByPart}` : ""}
        `,
            { skip, limit, collection }
          )
        );

        let asdf: PaginatedDocs = {};

        throw new Error("Method not implemented.");
      },
      countGlobalVersions: async () => {
        throw new Error("Method not implemented.");
      },
      countVersions: async () => {
        throw new Error("Method not implemented.");
      },
      createGlobal: async () => {
        throw new Error("Method not implemented.");
      },
      createGlobalVersion: async () => {
        throw new Error("Method not implemented.");
      },
      createVersion: async () => {
        throw new Error("Method not implemented.");
      },
      findGlobal: async () => {
        throw new Error("Method not implemented.");
      },
      findOne: async () => {
        throw new Error("Method not implemented.");
      },
      updateGlobal: async () => {
        throw new Error("Method not implemented.");
      },
      updateGlobalVersion: async () => {
        throw new Error("Method not implemented.");
      },
      updateVersion: async () => {
        throw new Error("Method not implemented.");
      },
      defaultIDType: "text",
      deleteMany: async () => {
        throw new Error("Method not implemented.");
      },
      deleteOne: async () => {
        throw new Error("Method not implemented.");
      },
      deleteVersions: async () => {
        throw new Error("Method not implemented.");
      },
      findDistinct: async () => {
        throw new Error("Method not implemented.");
      },
      findGlobalVersions: async () => {
        throw new Error("Method not implemented.");
      },
      findVersions: async () => {
        throw new Error("Method not implemented.");
      },
      name: "memgraph-adapter",
      packageName: "todo",
      queryDrafts: async () => {
        throw new Error("Method not implemented.");
      },
      rollbackTransaction: async () => {
        throw new Error("Method not implemented.");
      },
      updateMany: async () => {
        throw new Error("Method not implemented.");
      },
      updateOne: async () => {
        throw new Error("Method not implemented.");
      },
      upsert: async () => {
        throw new Error("Method not implemented.");
      },
      // Add other required methods and properties as needed for MemgraphAdapter
    });
  }

  return {
    name: "memgraph",
    defaultIDType: "text",
    init: adapter,
  };
}
