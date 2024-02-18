// using Microsoft.AspNetCore.SignalR;
// using WatchTogetherSignalR.Models;

// namespace WatchTogetherSignalR.Hubs;

// public class DrawHub : Hub {
    
//     private readonly SharedDb _shared;

//     public DrawHub(SharedDb shared) => _shared = shared;
//     public async Task JoinDraw(UserConnection conn) {
//         await Clients.All.SendAsync("RecieveMessage", "admin", $"{conn.Username} has joined");
//     }

//     public async Task JoinSpecificDrawRoom(UserConnection conn) {
//         await Groups.AddToGroupAsync(Context.ConnectionId, conn.DrawRoom);

//         _shared.connections[Context.ConnectionId] = conn;

//         await Clients.Group(conn.DrawRoom).SendAsync("RecieveMessage", "admin", $"{conn.Username} has joined {conn.DrawRoom}");
//     }

//     public async Task SendMessage(string message) {
//         if(_shared.connections.TryGetValue(Context.ConnectionId, out UserConnection conn)) {
//             await Clients.Group(conn.DrawRoom).SendAsync("RecieveMessage", conn.Username, message);
//         }
//     }
// }