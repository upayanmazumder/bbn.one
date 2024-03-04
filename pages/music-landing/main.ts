import { Footer } from "shared/footer.ts";
import { Body, Box, Button, Content, FullWidthSection, Image, Label, MIcon, WebGen } from "webgen/mod.ts";
import { DynaNavigation } from "../../components/nav.ts";
import { RegisterAuthRefresh } from "../_legacy/helper.ts";
WebGen();
await RegisterAuthRefresh();

Body(
    Content(
        FullWidthSection(
            DynaNavigation("Home")
        ),
        Box(
            Label("Drop in with your Audience."),
            Label("BBN Music, your gateway to unlimited music distribution at a low cost. Maximize your reach without limits. Join us and let the world hear your music."),
            Button("Drop your Music")
        ),
        Box(
            Label("Our pricing plan to disrupt the Market:"),
            Box(
                Box(
                    Label("Free Plan"),
                    Label("Your Revenue"),
                    Label("97%"),
                    Label("No Extra Cost"),
                    Box(
                        MIcon("check_circle"),
                        Label("Unlimited Drops"),
                        MIcon("check_circle"),
                        Label("Unlimited Artists"),
                        MIcon("check_circle"),
                        Label("Reach 52 Stores"),
                        MIcon("check_circle"),
                        Label("Reach 195 Countries"),
                        MIcon("check_circle"),
                        Label("No Payment Needed"),
                    ),
                    Button("Drop Now!")
                ),
                Box(
                    Label("Paid Plan"),
                    Label("Your Revenue"),
                    Label("100%"),
                    Label("1€ per Year"),
                    Box(
                        MIcon("check_circle"),
                        Label("Unlimited Drops"),
                        MIcon("check_circle"),
                        Label("Unlimited Artists"),
                        MIcon("check_circle"),
                        Label("Reach 52 Stores"),
                        MIcon("check_circle"),
                        Label("Reach 195 Countries"),
                        MIcon("check_circle"),
                        Label("No Revenue Cut"),
                        MIcon("check_circle"),
                        Label("Fully Customizable"),
                        MIcon("check_circle"),
                        Label("Priority Queue"),
                        MIcon("check_circle"),
                        Label("Priority Support"),
                    ),
                    Button("Coming Soon")
                ),
            )
        ),
        Box(
            Label("Let your fans enjoy your Drops where they feel home."),
            // TODO: Make a icon carousel
            Box(
                Label("Spotify"),
                Label("Apple Music"),
                Label("Deezer"),
                Label("Tidal"),
                Label("Amazon Music"),
                Label("Youtube Music"),
                Label("Soundcloud"),
                Label("And many more..."),
            )
        ),
        Box(
            Label("Make it. Drop it."),
            Label("Distributing music should be accessible without any credit card.")
        ),
        FullWidthSection(
            Box(
                Box(
                    Label("Why BBN Music"),
                    Button("Drop your Music")
                ),
                Box(
                    MIcon("spa"),
                    Label("Lowest Cut"),
                    Label("With our free plan, we only take a 3% cut as Royalties."),
                ),
                Box(
                    MIcon("public"),
                    Label("Global"),
                    Label("We support multiple distributors, without any extra cost for you.")
                ),
                Box(
                    MIcon("rocket_launch"),
                    Label("Unlimited"),
                    Label("No hard limits. You can manage as many Drops or Artists as you want.")
                )
            )
        ),
        Box(
            Label("Loved by Artists."),
            Label("See how our Artists value BBN Music.")
        ),
        Box(
            Label("The thing I love the most is the flexibility and the contactability of the entire BBN Music team. It is also just great to develop concepts and plans with motivated and very friendly people."),
            Box(
                Image("https://via.placeholder.com/150", "Avatar of Redz"),
                Label("Redz")
            )
        ),
        Box(
            Label("There is pretty much no other digital distributor that offers more and at the same time, works so closely with artists and who artists are so valued by and feel so understood by."),
            Box(
                Image("https://via.placeholder.com/150", "Avatar of Criticz"),
                Label("Criticz")
            )
        ),
        FullWidthSection(
            Footer()
        )
    )
        .setMaxWidth("1230px")
);