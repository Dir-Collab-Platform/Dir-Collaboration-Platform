function ChannelTag({ name, notif_count }) {
    return (
        <div className="relative flex items-center gap-2 bg-(--meta-tag-color) px-2.5 rounded-lg rounded-bl-none">
            <span className="text-(--channel-hash-color) font-bold">#</span>
            <p className="text-(--secondary-text-color)">{name}</p>
            {
                notif_count > 0 && 
                    <span className="notif-count flex items-center justify-center text-[4px] absolute top-[-22%] right-[-12%] bg-(--notification-count-bg) size-5 rounded-full">{notif_count}</span>
            }
        </div>
    )
}

export default function ChannelList() {
    return (
        <div className="channel-panel flex gap-5 overflow-x-scroll no-scrollbar p-2.5 bg-(--dimmer-dark-bg)">
            <ChannelTag name="general" notif_count={3} />
            <ChannelTag name="random" notif_count={0} />
            <ChannelTag name="development" notif_count={7} />
            <ChannelTag name="design" notif_count={0} />
            <ChannelTag name="marketing" notif_count={1} />
        </div>
    )
}