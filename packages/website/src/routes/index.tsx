import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import { getPayload } from "payload";
import { createAsync } from "@solidjs/router";
import { config } from "@shared-models";
import { Show } from "solid-js";

const getData = async () => {
  "use server";
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  return await payload.find({ collection: "posts", limit: 100 });
};

export default function Home() {
  let posts = createAsync(getData);
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Counter />
      <Show when={posts()}>
        {(posts) => (
          <p>
            There are {posts().docs.length} posts in the Payload CMS database.
          </p>
        )}
      </Show>
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
    </main>
  );
}
