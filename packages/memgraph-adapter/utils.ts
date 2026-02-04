import * as fs from "fs";

const filePath = "debugResponses.js";

// A robust and non-recursive serialization utility
export function safeStringify(obj: any): string {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      // Handle primitive values and built-in objects cleanly.
      if (value === null || typeof value !== "object") {
        return value;
      }
      if (key === "init" || key === "payload" || key === "connection") {
        return "[init or payload]";
      }

      // Handle circular references.
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);

      // Handle Promises by logging their status instead of recursing.
      if (value instanceof Promise) {
        return "[Promise]";
      }

      return value;
    },
    2 // Use 2-space indentation for readability.
  );
}

// Global flag to prevent infinite logging loops.

export function trackMethods<T extends object>(target: T): T {
  const handler: ProxyHandler<T> = {
    get(target: T, propKey: string | symbol, receiver: any) {
      const value = Reflect.get(target, propKey, receiver);
      console.log("Accessed property:", String(propKey), "type:", typeof value);
      if (typeof value === "function") {
        console.log("in function");
        return function (...args: any[]): any {
          // Prevent logging operations from re-triggering the proxy's `get` trap.

          try {
            const logMessage = `\n// Method: ${String(propKey)}\n args = ${safeStringify(args)}\n`;

            // Execute the original method with the correct 'this' context.
            const result = Reflect.apply(value, receiver, args);

            // Use Promise.resolve to handle both synchronous and asynchronous results.
            Promise.resolve(result)
              .then((resolvedResult) => {
                const resultMessage = ` result = ${safeStringify(resolvedResult)}\n\n`;
                fs.appendFile(filePath, logMessage + resultMessage, (err) => {
                  if (err) console.error("Error appending to file:", err);
                });
              })
              .catch((err) => {
                const errorMessage = `// Error: ${safeStringify(err)}\n\n`;
                fs.appendFile(
                  filePath,
                  logMessage + errorMessage,
                  (appendErr) => {
                    if (appendErr)
                      console.error("Error appending to file:", appendErr);
                  }
                );
              });

            return result;
          } catch (e) {
            console.error(`Error calling method '${String(propKey)}':`, e);
            fs.appendFile(
              filePath,
              `\n// Method: ${String(propKey)} - FAILED \n// Error: ${safeStringify(e)}\n\n`,
              (err) => {
                if (err) console.error("Error appending to file:", err);
              }
            );
            throw e;
          }
        };
      }
      if (typeof value === "string") {
        console.log("string value:", value);
      }
      return value;
    },
  };
  return new Proxy(target, handler) as T;
}
