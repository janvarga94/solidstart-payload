import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import { getPayload } from "payload";
import { createAsync } from "@solidjs/router";
import { config } from "@shared-models";

const getData = async () => {
    "use server";
    const payloadConfig = await config;
    const payload = await getPayload({ config: payloadConfig });
    return 3;
};

export default function Home() {
    let asyncstuff = createAsync(getData);
    return (
        <main>
            <Title>Hello World</Title>
            <Counter />
            <h1>Hello world! 1Jan {asyncstuff()}</h1>
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
