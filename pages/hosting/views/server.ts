import { Box, Card, CenterV, Color, CommonIconType, Dialog, Grid, Horizontal, IconButton, MaterialIcons, PlainText, Reactive, Spacer, Vertical } from "webgen/mod.ts";
import { state } from "../data.ts";
import './server.css';
import { API } from "../../manager/RESTSpec.ts";
import { refreshState } from "../loading.ts";

new MaterialIcons();

export const serverView = Reactive(state, "servers", () => Grid(
    ...state.servers.map(server => Card(Horizontal(
        Vertical(
            PlainText(server.name)
                .setFont(36 / 16, 700)
                .addClass("title-server"),
            PlainText(`${server.type} @ ${server.location} @ ${server.state}`)
                .setFont(1, 700)
                .addClass("gray-color", "same-height")
        ).setGap("17px"),
        Spacer(),
        CenterV(Horizontal(
            IconButton("dashboard", "dashboard")
                .onClick(async () => {
                    alert(JSON.stringify(await API.hosting(API.getToken()).serverId(server._id).get()));
                }),
            IconButton(CommonIconType.Edit, "edit"),
            IconButton(CommonIconType.Delete, "delete")
                .setColor(Color.Critical)
                .onClick(() => {
                    deleteServer(server._id);
                })
        ).setGap("1rem").addClass("icon-buttons-list"))

    )).setPadding("1.6rem").addClass("list-entry", "limited-width")
    )
).setGap("var(--gap)"));

function deleteServer(serverId: string) {
    Dialog(() => Box(PlainText("Deleting this Server, will result in data loss.\nAfter this point there is no going back.")).setMargin("0 0 1.5rem"))
        .setTitle("Are you sure?")
        .addButton("Cancel", "remove")
        .addButton("Delete", async () => {
            try {
                await API.hosting(API.getToken()).serverId(serverId).delete();
            } catch (error) {
                alert(JSON.stringify(error));
            }
            await refreshState();
            return "remove" as const;
        }, Color.Critical)
        .allowUserClose()
        .open();
}