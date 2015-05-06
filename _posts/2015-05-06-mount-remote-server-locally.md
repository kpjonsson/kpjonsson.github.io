---
title: "Smooth way to mount server locally"
layout: post
tags: 
  - sshfs
  - ssh
  - remote server
  - OS X
  - Mac
published: true
---

After struggling with few OS X apps promising to solve my problem with mounting my accounts on remote servers locally through ssh I found a neat solution, courtesy of [this blog post](https://jonathansblog.co.uk/sshfs-mount-remote-drive-in-finder).
It's very simple and only requires installation of a few things. Start with installing [osxfuse](http://osxfuse.github.io/) and [homebrew](http://brew.sh/). Then install sshfs and ssh-copy-id as such:
{% highlight bash %}
brew install sshfs
brew install ssh-copy-id
{% endhighlight %}

To then mount your drive of choice automatically upon startup, create a script:
{% highlight bash %}
mkdir /Volumes/ChooseName
sshfs -o reconnect -o volname=ChooseName -o follow_symlinks -o IdentityFile=/path/to/.ssh/id_rsa remotehost.com:path/ /Volumes/ChooseName
{% endhighlight %}

There are some other options to sshfs you might find useful, I particularly needed it to follow symbolic links. Running this scripts mounts the remote location, makes it available in Finder, and puts an icon on your desktop. Make it a startup item in System Preferences/Users & Groups/Login Items.

* * *
