---
slug: 'proxmox-mount-points'
title: 'Sharing mountpoints on unprivileged Proxmox LXCs'
pubDate: "2023-07-12"
draft: false
tags: ['proxmox', 'homelab']
---

Unprivileged LXCs' increased security and isolation, unfortunately, bring about some difficulties when sharing resources between the host and the guest. This issue often shows up as `Permission denied` or `Operation not permitted` errors when trying to access a directory on the host. Usual battle tactics like `chown` and `chmod` make no difference. One could resort to pure network-based solutions, but that’s not really efficient. Fortunately, it is possible to map a guest user’s UID/GID to that of the host by creating another user on the host with the right settings and permissions.

## Binding mountpoints

Bind mounts allow us to access previously mounted directories from a different location in [POSIX](https://en.wikipedia.org/wiki/POSIX) systems. Proxmox can bind mount points between the host and the guest either by running this command:

```
pct set <CONTAINER_ID> -mp0 <ABSOLUTE_PATH_ON_HOST>,mp=<ABSOLUTE_PATH_ON_GUEST>
```

or by adding this line to the LXC config file under `/etc/pve/lxc/<CONTAINER_ID>.conf` on the host:

```
mp0: <ABSOLUTE_PATH_ON_HOST>,mp=<ABSOLUTE_PATH_ON_GUEST>
```

This will allow you to access the host’s shared directory from the container, but the contents will only be readable. For full access, we need to `chown` the mounted directory on the host with the correct UID/GID.

## Ownership

By default, unprivileged LXCs map guest system users on the host by applying an offset, usually starting at `100000`. This mapping comes from `/etc/subuid` and `/etc/subgid` on the host. Proxmox typically uses `100000` as the starting offset, but it can differ depending on your setup.

For example, `root` inside the container (`0:0`) is mapped to `100000:100000` on the host. Likewise, guest UID/GID `1:1` becomes `100001:100001` on the host.

So, if all we need is for the container’s `root` user to access the mount point, we can run this on the host:

```
chown 100000:100000 <MOUNT_POINT_ON_HOST> -R
```

For other users, the general formula is:

```
Host UID/GID = Guest UID/GID + OFFSET
```

(where `OFFSET` is usually `100000` but may vary).

For example, if you create a user inside the guest with UID `1000`:

```
# On the guest
useradd -u 1000 new-user-name
```

then on the host, this user will appear as UID `101000` (assuming the `100000` offset). To give proper ownership, you need to run:

```
# On the host
chown 101000:101000 <MOUNT_POINT_ON_HOST> -R
```

> Note: If you want host users and container users to share the exact same UID/GID without the offset, you can configure custom ID mappings in the LXC config using `lxc.idmap`, but that requires extra setup.

#### Sources

- https://itsembedded.com/sysadmin/proxmox_bind_unprivileged_lxc/
