import { Button, ButtonStyle, loadingWheel, Center, Color, Horizontal, PlainText, Spacer, Vertical, View, WebGen, Custom, Box, img, CenterV, Component, createElement } from "../../deps.ts";
import '../../assets/css/main.css';
import '../../assets/css/music.css'
import artwork from "../../assets/img/template-artwork.png";
import { DynaNavigation } from "../../components/nav.ts";
import { GetCachedProfileData, ProfileData, Redirect, RegisterAuthRefresh, renewAccessTokenIfNeeded } from "./helper.ts";
import { API, Drop } from "./RESTSpec.ts";

WebGen({
})
Redirect();
RegisterAuthRefresh();
const imageCache = new Map<string, string>();
function MediaQuery(query: string, view: (matches: boolean) => Component) {
    const holder = createElement("div");
    holder.innerHTML = "";
    holder.append(view(matchMedia(query).matches).draw())
    matchMedia(query).addEventListener("change", ({ matches }) => {
        holder.innerHTML = "";
        holder.append(view(matches).draw())
    }, { passive: true })
    return Custom(holder);
}
const view = View<{ list: Drop[], reviews: Drop[], type: Drop[ "type" ] }>(({ state, update }) => Vertical(
    DynaNavigation("Music", GetCachedProfileData()),
    Horizontal(
        Vertical(
            Horizontal(
                PlainText(`Hi ${GetCachedProfileData().name}! 👋`)
                    .setFont(2.260625, 700),
                Spacer()
            ).setMargin("0 0 18px"),
            Horizontal(
                Button(`Published ${getListCount([ "PUBLISHED" ], state)}`)
                    .setColor(Color.Colored)
                    .addClass("tag")
                    .setStyle(state.type == "PUBLISHED" ? ButtonStyle.Normal : ButtonStyle.Secondary)
                    .onClick(() => update({ type: "PUBLISHED" })),
                Button(`Unpublished ${getListCount([ "UNDER_REVIEW", "PRIVATE" ], state)}`)
                    .setColor(Color.Colored)
                    .setStyle(state.type == "PRIVATE" ? ButtonStyle.Normal : ButtonStyle.Secondary)
                    .onClick(() => update({ type: "PRIVATE" }))
                    .addClass("tag"),
                state.list?.find(x => x.type == "UNSUBMITTED") ?
                    Button(`Drafts ${getListCount([ "UNSUBMITTED" ], state)}`)
                        .setColor(Color.Colored)
                        .onClick(() => update({ type: "UNSUBMITTED" }))
                        .setStyle(state.type == "UNSUBMITTED" ? ButtonStyle.Normal : ButtonStyle.Secondary)
                        .addClass("tag")
                    : null,
                state.reviews && state.reviews?.length != 0 ?
                    Button(`Reviews (${state.reviews.length})`)
                        .setColor(Color.Colored)
                        .onClick(() => update({ type: "UNDER_REVIEW" }))
                        .setStyle(state.type == "UNDER_REVIEW" ? ButtonStyle.Normal : ButtonStyle.Secondary)
                        .addClass("tag")
                    : null,
                Spacer()
            ).setGap("10px")
        ),
        Spacer(),
        Vertical(
            Spacer(),
            Button("Submit new Drop")
                .onPromiseClick(async () => {
                    const id = await API.music(API.getToken()).post();
                    // TODO: Currently not supported:
                    // location.href = `/music/new-drop/${id}`;
                    location.href = `/music/new-drop?id=${id}`;
                }),
            Spacer()
        )
    )
        .setPadding("5rem 0 0 0")
        .addClass("action-bar")
        .addClass("limited-width"),
    Box((() => {
        if (!state.list)
            return Custom(loadingWheel() as Element as HTMLElement)
        if (state.reviews && state.reviews.length != 0 && state.type == "UNDER_REVIEW")
            return Vertical(
                state.reviews.map(x => Horizontal(
                    Vertical(
                        PlainText(x.title ?? "(no text)")
                            .setMargin("-0.4rem 0 0")
                            .setFont(2, 700),
                        PlainText(x.id + " - " + x.user)
                    ),
                    Spacer(),
                    CenterV(
                        Button("Approve")
                            .setStyle(ButtonStyle.Inline)
                            .setColor(Color.Colored)
                            .addClass("tag")
                            .onPromiseClick(async () => {
                                const form = new FormData();
                                form.set("type", "PUBLISHED");
                                await API.music(API.getToken()).id(x.id).put(form);

                                const list = await API.music(API.getToken()).reviews.get();
                                view.viewOptions().update({ reviews: list })
                            })
                    ),
                    CenterV(
                        Button("Meta")
                            .setStyle(ButtonStyle.Inline)
                            .setColor(Color.Colored)
                            .addClass("tag")
                            .onClick(() => {
                                alert(JSON.stringify(x))
                            })
                    ),
                    CenterV(
                        x.song
                            ? Button(`Download (${x.song.length})`)
                                .setStyle(ButtonStyle.Inline)
                                .setColor(Color.Colored)
                                .onPromiseClick(async () => {
                                    const { code } = await API.music(API.getToken()).id(x.id).songSownload();
                                    window.open(`${API.BASE_URL}music/${x.id}/songs-download/${code}`, '_blank')
                                })
                                .addClass("tag")
                                .setMargin("0 0.5rem")
                            : PlainText("No Songs")
                                .setMargin("0 1.5rem")
                                .setJustify("center")
                    ).setJustify("center")
                )
                    .setPadding("0.5rem")
                    .addClass("list-entry")
                    .addClass("limited-width"))
            ).setGap("1rem").setMargin("1rem 0 0")
        if (state.list.length != 0)
            return Vertical(
                CategoryRender(
                    state.list
                        .filter(x => state.type == "PUBLISHED" ? x.type == "PUBLISHED" : true)
                        .filter(x => state.type == "PRIVATE" ? x.type == "PRIVATE" || x.type == "UNDER_REVIEW" : true)
                        .filter(x => state.type == "UNSUBMITTED" ? x.type == "UNSUBMITTED" : true)
                        .filter((_, i) => i == 0),
                    "Latest Drop"
                ),
                CategoryRender(
                    state.list
                        .filter(x => state.type == "PUBLISHED" ? x.type == "PUBLISHED" : true)
                        .filter(x => state.type == "PRIVATE" ? x.type == "PRIVATE" || x.type == "UNDER_REVIEW" : true)
                        .filter(x => state.type == "UNSUBMITTED" ? x.type == "UNSUBMITTED" : true)
                        .filter((_, i) => i > 0),
                    "History"
                ),
                state.list
                    .filter(x => state.type == "PUBLISHED" ? x.type == "PUBLISHED" : true)
                    .filter(x => state.type == "PRIVATE" ? x.type == "PRIVATE" || x.type == "UNDER_REVIEW" : true)
                    .filter(x => state.type == "UNSUBMITTED" ? x.type == "UNSUBMITTED" : true)
                    .length == 0
                    ?
                    Center(
                        PlainText(`You don’t have any ${EnumToDisplay(state.type)} Drops`)
                            .setFont(1.6, 700)
                    ).setMargin("100px 0 0")
                    : null
            )
                .setGap("20px");
        return Center(PlainText("Wow such empty")).setPadding("5rem");
    })()).addClass("loading"),
))
    .change(({ update }) => {
        update({ type: "PUBLISHED" })
    })
    .appendOn(document.body);
renewAccessTokenIfNeeded(GetCachedProfileData().exp).then(() => {
    API.music(API.getToken()).list.get()
        .then(x => {
            Promise.all(x
                .map(async x => ([
                    x.id,
                    x.artwork ? URL.createObjectURL(await API.music(API.getToken()).id(x.id).artwork()) : undefined
                ] as [ key: string, value?: string ])
                ))
                .then(x => {
                    for (const [ key, value ] of x.filter(([ _, value ]) => value)) {
                        imageCache.set(key, value!);
                    }
                    view.viewOptions().update({});
                })

            return x;
        })
        .then(x => view.viewOptions().update({ list: x }))

    if (GetCachedProfileData().groups.find(x => x.permissions.includes("songs-review")))
        API.music(API.getToken()).reviews.get().then(x => view.viewOptions().update({ reviews: x }))
})


function getListCount(list: Drop[ "type" ][], state: Partial<{ list: Drop[]; type: Drop[ "type" ]; aboutMe: ProfileData; }>) {
    const length = state.list?.filter(x => list.includes(x.type)).length;
    if (length) return `(${length})`
    return "";
}

function EnumToDisplay(state?: Drop[ "type" ]) {
    switch (state) {
        case "PRIVATE": return "unpublished";
        case "PUBLISHED": return "published";
        default: return "";
    }
}

function CategoryRender(dropList: Drop[], title: string): Component | (Component | null)[] | null {
    if (dropList.length == 0)
        return null;
    return [
        PlainText(title)
            .addClass("list-title")
            .addClass("limited-width"),
        MediaQuery("(max-width: 600px)",
            (matches) =>
                Box(...dropList.map(x => DropEntry(x, matches)))
        ),
    ];
}

function DropEntry(x: Drop, matches: boolean): Component {
    return Horizontal(
        Custom(img(imageCache.get(x.id) ?? artwork)),
        CenterV(
            PlainText(x.title ?? "(no name)")
                .setMargin("-0.4rem 0 0")
                .setFont(matches ? 1.2 : 2.25, 700),
            PlainText(x.release ?? "(no release date)")
                .setFont(matches ? 0.8 : 1, 700)
                .addClass("entry-subtitle")
        ),
        CenterV(
            PlainText(x.upc ? `UPC ${x.upc}` : "(no upc number)")
                .addClass("entry-subtitle")
                .setFont(matches ? 0.8 : 1, 700)
        ),
        Spacer(),
        x.type == "UNDER_REVIEW"
            ? CenterV(PlainText("Under Review")
                .addClass("entry-subtitle", "under-review"))
            : null
    )
        .setGap("40px")
        .addClass("list-entry")
        .addClass("limited-width")
        .onClick(() => x.type === "UNSUBMITTED" ? location.href = "/music/new-drop?id=" + x.id : {});
}
