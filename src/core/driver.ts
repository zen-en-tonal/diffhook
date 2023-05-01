import { ServiceContainer } from "./serviceContainer";

export abstract class Driver {
    
    constructor(
        readonly container: Readonly<ServiceContainer>
    ) { }

    async init() {
        const keys = Object.keys(this.container)
        const tasks = keys.map(k => this.container[k].init())
        await Promise.all(tasks)
    }

    private async runService(key: string) {
        const service = this.container[key]
        await service.run()
    }

    protected async runServices() {
        const keys = Object.keys(this.container)
        const tasks = keys.map(k => {
            return this.runService(k)
        })
        await Promise.all(tasks)
    }

    abstract run(): void
}
