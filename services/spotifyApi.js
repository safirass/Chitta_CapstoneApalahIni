const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID";
const CLIENT_SECRET = "YOUR_SPOTIFY_CLIENT_SECRET";

export const getSpotifyToken = async () => {
const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
        "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: "grant_type=client_credentials",
});
const data = await res.json();
return data.access_token;
};

export const getRelaxationMusic = async (token) => {
const res = await fetch(
    "https://api.spotify.com/v1/search?q=relaxation%20music&type=track&limit=10",
    {
    headers: { Authorization: `Bearer ${token}` },
    }
);
const data = await res.json();
return data.tracks.items;
};
