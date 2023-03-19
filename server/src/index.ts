import { initCluster } from '~/utils/initCluster'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
	initCluster()
}

main()
