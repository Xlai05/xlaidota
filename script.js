async function searchPlayer() {
    const steamId = document.getElementById('steamId').value;
    if (!steamId) return alert("Please enter a Steam ID");

    const response = await fetch(`https://api.opendota.com/api/players/${steamId}`);
    const playerData = await response.json();

    document.getElementById('player-info').innerHTML = `
        <h3>${playerData.profile.personaname}</h3>
        <img src="${playerData.profile.avatarfull}" alt="Avatar">
        <p>Rank: ${playerData.rank_tier || "Unranked"}</p>
    `;

    const matchResponse = await fetch(`https://api.opendota.com/api/players/${steamId}/recentMatches`);
    const matches = await matchResponse.json();

    const teammateIds = new Set();
    for (const match of matches) {
        const matchDetail = await fetch(`https://api.opendota.com/api/matches/${match.match_id}`);
        const matchData = await matchDetail.json();
        matchData.players.forEach(player => {
            if (player.account_id && player.account_id !== Number(steamId)) {
                teammateIds.add(player.account_id);
            }
        });
    }

    let friendsHtml = '<h4>Recent Teammates</h4><ul>';
    for (const id of teammateIds) {
        const friendData = await fetch(`https://api.opendota.com/api/players/${id}`);
        const friend = await friendData.json();
        friendsHtml += `<li><img src="${friend.profile.avatar}" alt="Avatar"> ${friend.profile.personaname}</li>`;
    }
    friendsHtml += '</ul>';

    document.getElementById('player-info').innerHTML += friendsHtml;
}
