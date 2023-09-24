import { API, Navigation, stupidErrorAlert } from "shared";
import { Button, Card, Color, Grid, Label, MediaQuery, State, Table, Vertical, View, WebGen, isMobile } from "webgen/mod.ts";
import { DynaNavigation } from "../../components/nav.ts";
import { Wallet } from "../../spec/music.ts";
import { RegisterAuthRefresh, changeThemeColor, renewAccessTokenIfNeeded } from "../_legacy/helper.ts";
import './wallet.css';

await RegisterAuthRefresh();

WebGen({
    events: {
        themeChanged: changeThemeColor()
    }
});

const state = State({
    wallet: <Wallet | undefined>undefined,
    loaded: false
});

View(() => Vertical(
    DynaNavigation("Wallet"),
    state.$loaded.map(() => Vertical(
        Navigation({
            title: "Your Wallet",
            actions: [
                Button("Request Payout")
                    .onPromiseClick(async () => {
                        await API.wallet.requestPayout();
                        alert(`Your payout request has been submitted.`);
                    })
                    .setColor(state.wallet?.balance?.unrestrained! + state.wallet?.balance?.restrained! > 10 ? Color.Grayscaled : Color.Disabled)
            ]
        }).addClass(
            isMobile.map(mobile => mobile ? "mobile-navigation" : "navigation"),
            "limited-width"
        ),
        MediaQuery("(max-width: 700px)", (small) =>
            state.$wallet.map(() =>
                Vertical(
                    Grid(
                        Card(
                            Grid(
                                Label(`${Number(state.wallet?.balance?.unrestrained! + state.wallet?.balance?.restrained!).toFixed(2)} £`)
                                    .setFont(2, 700),
                                Label("Balance")
                                    .setFont(1, 700)
                                    .addClass("gray-color")
                            )
                                .addClass("details-item")
                        ),
                        Card(
                            Grid(
                                Label(`${state.wallet?.cut}%`)
                                    .setFont(2, 700),
                                Label("Your Cut")
                                    .setFont(1, 700)
                                    .addClass("gray-color")
                            )
                                .addClass("details-item")
                        ),
                    )
                        .setEvenColumns(small ? 1 : 2)
                        .setGap("var(--gap)"),
                    Table([
                        [ "Amount", "auto", ({ amount }) => Label(`${amount.toFixed(2)} £`) ],
                        [ "Description", "auto", ({ description }) => Label(description) ],
                        [ "Counterparty", "auto", ({ counterParty }) => Label(counterParty) ],
                        [ "Date", "auto", ({ timestamp }) => Label(new Date(Number(timestamp)).toDateString()) ],
                    ], state.wallet?.transactions ?? [])
                ).setGap("var(--gap)")
            ).asRefComponent()
        )
    )).asRefComponent().addClass("limited-width")
)).appendOn(document.body);

renewAccessTokenIfNeeded()
    .then(() => refreshState())
    .then(() => state.loaded = true);

async function refreshState() {
    state.wallet = await API.wallet.get().then(stupidErrorAlert);
    if (state.wallet)
        state.wallet.transactions = state.wallet.transactions.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
    state.loaded = true;
}