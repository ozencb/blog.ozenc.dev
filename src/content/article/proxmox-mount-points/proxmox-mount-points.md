---
slug: 'proxmox-mount-points'
title: 'Sharing mountpoints on unprivileged Proxmox LXCs'
pubDate: "2023-07-12"
draft: false
tags: ['proxmox', 'homelab']
---

Unprivileged LXCs' increased security and isolation, unfortunately, bring about some difficulties in sharing resources between the host and the guest. This particular issue usually reveals itself when users face all kinds of `Permission denied` or `Operation not permitted` errors while trying to access a directory on the host, and usual battle tactics like `chown` and `chmod` make no difference. One can go ahead and use pure network solutions but that's not really resourceful. Fortunately, it is possible to map guest user's UID/GID mapping to that of host's by creating another user on the host with right settings and permissions.

## Binding mountpoints

Bind mounts allow us to access previously mounted directories from a different location in [Posix](https://en.wikipedia.org/wiki/POSIX) systems. Proxmox can bind mountpoints between the host and the guest by either running this command:


```
pct set <CONTAINER_ID> -mp0 <ABSOLUTE_PATH_ON_HOST>,mp=<ABSOLUTE_PATH_ON_GUEST>
```

or by adding this line to LXC config file under `/etc/pve/lxc/<CONTAINER_ID>.conf` on the host:

```
mp0: <ABSOLUTE_PATH_ON_HOST>,mp=<ABSOLUTE_PATH_ON_GUEST>
```

This will allow you to access host's shared directory from the container but contents will only be readable. For full access, we will `chown` the mounted directory on the host with correct UID/GID.

## Ownership

By default, LXCs map the guest system's user in the host by adding `100000` to it.

Since the `root` has a `0:0` mapping, we can assume that any LXC's root user is mapped to `100000:100000` UID/GID. The same goes for any user in the guest; `1:1` gets mapped to `100001:100001` in the host.

So, if all we need is to use the `root` user (`0:0`) in our container to access the mountpoint, we can simply run this on the host:

```
chown 100000:100000 <MOUNT_POINT_ON_HOST> -R
```

For other users, we can follow the same formula of `Host UID/GID = Guest UID/GID + 100000` and define users with predefined UID/GIDs on the host:

```
# On the guest
useradd -u 1000 new-user-name
```

```
# On the host
chown 1000:1000 <MOUNT_POINT_ON_HOST> -R
```
#### Sources

- https://itsembedded.com/sysadmin/proxmox_bind_unprivileged_lxc/