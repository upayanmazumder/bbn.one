import { API, SliderInput, stupidErrorAlert } from "shared/mod.ts";
import { format } from "std/fmt/bytes.ts";
import { Color, Dialog, DropDownInput, Grid, Label, MediaQuery, State, TextInput, Vertical } from "webgen/mod.ts";
import locations from "../../../../data/locations.json" assert { type: "json" };
import serverTypes from "../../../../data/servers.json" assert { type: "json" };
import { Server } from "../../../../spec/music.ts";
import { MB, state } from "../../data.ts";
import { deleteServerDialog } from "./deleteServerDialog.ts";

export function editServerDialog(server: Server, versions: string[]) {
    const data = State({
        name: server.name,
        memory: server.limits.memory,
        disk: server.limits.disk,
        cpu: server.limits.cpu,
        location: server.location,
        version: server.version
    });
    Dialog(() => Vertical(
        Label(`A ${serverTypes[ server.type ].name} Server.`),
        MediaQuery("(max-width: 700px)", (small) => Grid(
            [
                {
                    width: small ? 1 : 2
                },
                TextInput("text", "Friendly Name")
                    .sync(data, "name")
            ],
            DropDownInput("Location", Object.keys(locations))
                .setRender(location => locations[ location as keyof typeof locations ])
                .sync(data, "location"),
            SliderInput("Memory (RAM)")
                .setMin(1)
                .setMax(state.meta.limits.memory - state.meta.used.memory + server.limits.memory)
                .sync(data, "memory")
                .setRender((val) => format(val * MB)),
            SliderInput("Disk (Storage)")
                .setMin(server.limits.disk)
                .setMax(state.meta.limits.disk - state.meta.used.disk + server.limits.disk)
                .sync(data, "disk")
                .setRender((val) => format(val * MB)),
            SliderInput("CPU (Processor)")
                .setMin(1)
                .setMax(state.meta.limits.cpu - state.meta.used.cpu + server.limits.cpu)
                .sync(data, "cpu")
                .setRender((val) => `${val.toString()} %`),
            DropDownInput("Version", versions)
                .sync(data, "version")
        )
            .setGap("var(--gap)")
            .setEvenColumns(small ? 1 : 3)
        ).removeFromLayout()
    )
        .setGap("var(--gap)")
    )
        .setTitle(`Edit '${server.name}'`)
        .allowUserClose()
        .addButton("Delete Server", () => {
            deleteServerDialog(server._id);
            return "remove";
        }, Color.Critical)
        .addButton("Close", "remove")
        .addButton("Save", async () => {
            await API.hosting.serverId(server._id)
                .edit(data)
                .then(stupidErrorAlert);

            location.reload();
            return "remove" as const;
        })
        .open();
}
