import { Button } from "@/components/ui/button"

const PageHeader = ({
    title,
    description,
    buttonText,
    onButtonClick,
}) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold">
                    {title}
                </h1>

                <p className="text-muted-foreground mt-1">
                    {description}
                </p>
            </div>

            {buttonText && (
                <Button onClick={onButtonClick}>
                    {buttonText}
                </Button>
            )}
        </div>
    )
}

export default PageHeader