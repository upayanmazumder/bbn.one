import { delay } from "@std/async";
import { API, StreamingUploadHandler, stupidErrorAlert } from "shared/mod.ts";
import { AdvancedImage, Reference } from "webgen/mod.ts";
import { ArtistRef, Song } from "../../spec/music.ts";

export function uploadSongToDrop(songs: Reference<Song[]>, artists: ArtistRef[], language: string, primaryGenre: string, secondaryGenre: string, uploadingSongs: Reference<{ [key: string]: number }[]>, file: File) {
    const uploadId = crypto.randomUUID();
    uploadingSongs.addItem({ [uploadId]: 0 });

    const cleanedUpTitle = file.name
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\.[^/.]+$/, "");

    songs.addItem({
        _id: uploadId,
        title: cleanedUpTitle,
        artists,
        language,
        instrumental: false,
        explicit: false,
        primaryGenre,
        secondaryGenre,
        year: new Date().getFullYear(),
        file: undefined!,
    });

    StreamingUploadHandler(`music/songs/upload`, {
        failure: () => {
            songs.setValue(songs.getValue().filter((x) => x._id != uploadId));
            uploadingSongs.setValue(uploadingSongs.getValue().map((x) => ({ ...x, [uploadId]: -1 })));
            alert("Your Upload has failed. Please try a different file or try again later");
        },
        uploadDone: () => {
            uploadingSongs.setValue(uploadingSongs.getValue().map((x) => ({ ...x, [uploadId]: 100 })));
        },
        credentials: () => API.getToken(),
        backendResponse: async (id: string) => {
            uploadingSongs.setValue(uploadingSongs.getValue().filter((x) => !x[uploadId]));
            const song = await API.music.songs.create({
                title: cleanedUpTitle,
                artists,
                language,
                instrumental: false,
                explicit: false,
                primaryGenre,
                secondaryGenre,
                year: new Date().getFullYear(),
                file: id,
            }).then(stupidErrorAlert);
            songs.setValue(songs.getValue().map((x) => x._id == uploadId ? { ...x, _id: song.id, file: id } : x));
        },
        // deno-lint-ignore require-await
        onUploadTick: async (percentage) => {
            uploadingSongs.setValue(uploadingSongs.getValue().map((x) => ({ ...x, [uploadId]: percentage })));
        },
    }, file);
}

export function uploadArtwork(id: string, file: File, artworkClientData: Reference<AdvancedImage | undefined>, artwork: Reference<string | undefined>) {
    const blobUrl = URL.createObjectURL(file);
    artworkClientData.setValue({ type: "uploading", filename: file.name, blobUrl, percentage: 0 });

    setTimeout(() => {
        StreamingUploadHandler(`music/drops/${id}/upload`, {
            failure: () => {
                artworkClientData.setValue(undefined);
                alert("Your Upload has failed. Please try a different file or try again later");
            },
            uploadDone: () => {
                artworkClientData.setValue({ type: "waiting-upload", filename: file.name, blobUrl });
            },
            credentials: () => API.getToken(),
            backendResponse: (id) => {
                artworkClientData.setValue({ type: "direct", source: async () => await file });
                artwork.setValue(id);
            },
            onUploadTick: async (percentage) => {
                artworkClientData.setValue({ type: "uploading", filename: file.name, blobUrl, percentage });
                await delay(2);
            },
        }, file);
    });
}
