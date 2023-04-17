import { PlainText, Vertical } from "https://raw.githubusercontent.com/lucsoft/WebGen/3f922fc/mod.ts";
import { Entry } from "../../manager/misc/Entry.ts";
import { state } from "../state.ts";
import { DropType } from "../../../spec/music.ts";
import { RenderEntry } from "./entry.ts";

export function listPayouts() {
    return state.payouts && state.payouts.length > 0 ? [
        PlainText("Payouts")
            .addClass("list-title")
            .addClass("limited-width"),
        Vertical(state.payouts!.map(x =>
            Entry(x._id, x.importer + " - " + x.file)
        )).setGap("1rem"),
    ] : [
        PlainText("No Payouts")
            .addClass("list-title")
            .addClass("limited-width"),
        PlainText("All done! You are now allowed to lean back and relax. 🧋")
            .addClass("limited-width"),
    ];
}

export function listReviews() {
    return Vertical(
        (state.reviews?.find(x => x.type == DropType.UnderReview)) ? [
            PlainText("Reviews")
                .addClass("list-title")
                .addClass("limited-width"),
            Vertical(...state.reviews!.filter(x => x.type == DropType.UnderReview).map(x => RenderEntry(x))).setGap("1rem"),
        ] : [
            PlainText("No Reviews")
                .addClass("list-title")
                .addClass("limited-width"),
            PlainText("All done! You are now allowed to lean back and relax. 🧋")
                .addClass("limited-width"),
        ],
        state.reviews!.filter(x => x.type == DropType.Publishing).length == 0 ? null :
            PlainText("Publishing")
                .addClass("list-title")
                .addClass("limited-width"),
        ...state.reviews!.filter(x => x.type == DropType.Publishing).map(x =>
            RenderEntry(x)
        ),
        PlainText("Published")
            .addClass("list-title")
            .addClass("limited-width"),
        ...state.reviews!.filter(x => x.type == DropType.Published).map(x =>
            RenderEntry(x)
        ),
        PlainText("Private")
            .addClass("list-title")
            .addClass("limited-width"),
        ...state.reviews!.filter(x => x.type == DropType.Private).map(x =>
            RenderEntry(x)
        ),
        PlainText("Rejected")
            .addClass("list-title")
            .addClass("limited-width"),
        ...state.reviews!.filter(x => x.type == DropType.ReviewDeclined).map(x =>
            RenderEntry(x)
        ),
        PlainText("Drafts")
            .addClass("list-title")
            .addClass("limited-width"),
        ...state.reviews!.filter(x => x.type == DropType.Unsubmitted).map(x =>
            RenderEntry(x)
        )
    )
        .setGap("1rem");
}