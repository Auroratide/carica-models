import fs from 'fs/promises'
import path from 'path'
import { expect } from 'chai'

const walk = (dir, fn) => fs.readdir(dir).then(files => {
    return Promise.all(files.map(file => {
        const fullPath = path.join(dir, file)
        return fs.stat(fullPath).then(f => {
            if (f.isDirectory()) {
                return walk(fullPath, fn)
            } else {
                return fn(fullPath)
            }
        })
    }))
})

describe('validity', () => {
    it('each model defines the carica namespace', async () => {
        const containsCaricaNamespace = (svg) => /xmlns:carica="https:\/\/auroratide\.com\/carica"/.test(svg)
        const filesLackingNamespace = []

        await walk('models', filename => {
            return fs.readFile(filename, { encoding: 'utf-8' }).then(data => {
                if (!containsCaricaNamespace(data))
                    filesLackingNamespace.push(filename)
            })
        })

        // this assertion will list files lacking the namespace
        expect(filesLackingNamespace).to.be.empty
    })
})
