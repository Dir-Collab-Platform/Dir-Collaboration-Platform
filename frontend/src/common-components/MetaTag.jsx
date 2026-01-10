export default function MetaTag({name}) {
    return (
        <span className="bg-(--meta-tag-color) text-(--secondary-text-color) h-fit px-2.5 py-0.5 rounded-2xl text-center border border-(--main-border-color)">
            {name}
        </span>
    )
}