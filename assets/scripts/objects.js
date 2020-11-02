var events = {}
var localLanguage = navigator.language.split('-')[0]

class Event {
    constructor(type, date, location) {
        while (true) {
            var id = Math.floor(Math.random() * 16**6).toString(16).toUpperCase().padStart(6, '0')
            if (!(id in events)) {
                this.id = id
                break
            }
        }
        events[this.id] = this

        this.type = type
        this.date = date
        this.location = location
        this.participants = {}
    }

    addParticipant = function(person, role) {
        this.participants[role] = person
    }

    static addBirth = function(child, father, mother, date, location) {
        var birth = new Event('birth', date, location)
        birth.participants.child = child
        birth.participants.father = father
        birth.participants.mother = mother
        child.events['birth'] = birth

        if (child.gender != undefined) {
            child.addParent(
                father, 
                Person.relationships.parent.fatherBiological, 
                Person.relationships.child[child.gender ? sonBiological : daughterBiological])
            child.addParent(
                mother, 
                Person.relationships.parent.motherBiological, 
                Person.relationships.child[child.gender ? sonBiological : daughterBiological])
        }

        var hadChild = new Event('had child', date, location)
        birth.participants.child = child
        birth.participants.father = father
        birth.participants.mother = mother
        father.events['had child'] = hadChild
        mother.events['had child'] = hadChild
    }
}

class Date {
    constructor(year, month, day) {
        function getRange(value) {
            let range
            if (value instanceof Array) {
                switch (year.length) {
                    case 0: range = null; break
                    case 1: range = { 
                        value: value[0] 
                    }; break
                    case 2: range = { 
                        start: value[0], 
                        end: value[1] 
                    }; break
                    default: range = { 
                        value: value[0],
                        start: value[1],
                        end: value[2] 
                    };
                }
            } else if (value.constructor == Object) {
                range = value
            } else {
                range.value = value
            }
        }

        this.year = getRange(year)
        this.month = getRange(month)
        this.day = getRange(day)
    }
    getRange = function() {
        return {
            start: {
                year: this.year.start,
                month: this.month.start,
                day: this.day.start
            },
            value: {
                year: this.year.value,
                month: this.month.value,
                day: this.day.value
            },
            end: {
                year: this.year.end,
                month: this.month.end,
                day: this.day.end
            }
        }
    }
}

class Location {
    constructor(name) {
        this.name = name
    }

    addName = function(name) {
        this.name = name
        return this
    }
    
    addCoordinates = function(latitude, longitude) {
        this.latitude = latitude
        this.longitude = longitude
        return this
    }
}

class Person {
    static list = {}
    constructor() {
        while (true) {
            var id = Math.floor(Math.random() * 16**6).toString(16).toUpperCase().padStart(6, '0')
            if (!(id in Person.list)) {
                this.id = id
                break
            }
        }
        Person.list[this.id] = this

        this.names = []
        this.events = {}
        this.relationships = {
            parent: {},
            child: {},
            spouse: {}
        }
    }

    static findByID(id) {
        Person.list[id]
    }
    static findAllByName(nameValue, namePart=null) {
        nameValue = nameValue.toString().toLowerCase()
        if (namePart != null) 
            namePart = namePart.toString().toLowerCase()

        var people = []
        for (const id in Person.list) {
            const person = Person.list[id];
            person:
            for (const name of person.names) {
                for (const key in name) {
                    const part = name[key]
                    if (part.constructor == Object
                    && (namePart == null || key == namePart)
                    &&  part.value != null
                    &&  part.value.toLowerCase().includes(nameValue)) {
                        people.push(person)
                        break person
                    }
                }
            }
        }
        return people
    }

    display = function() {
        return this.preferredName.display()
    }

    /* RELATIONSHIPS */
    static relationships = {
        parent: {
            fatherBiological: {title: 'father', method: 'biological', key: 'fatherBiological'},
            fatherAdoptive: {title: 'father', method: 'adoptive', key: 'fatherAdoptive'},
            fatherStep: {title: 'father', method: 'step', key: 'fatherStep'},
            motherBiological: {title: 'mother', method: 'biological', key: 'motherBiological'},
            motherAdoptive: {title: 'mother', method: 'adoptive', key: 'motherAdoptive'},
            motherStep: {title: 'mother', method: 'step', key: 'motherStep'}
        },
        child: {
            sonBiological: {title: 'son', method: 'biological', key: 'sonBiological'},
            sonAdoptive: {title: 'son', method: 'adoptive', key: 'sonAdoptive'},
            sonStep: {title: 'son', method: 'step', key: 'sonStep'},
            daughterBiological: {title: 'daughter', method: 'biological', key: 'daughterBiological'},
            daughterAdoptive: {title: 'daughter', method: 'adoptive', key: 'daughterAdoptive'},
            daughterStep: {title: 'daughter', method: 'step', key: 'daughterStep'}
        },
        spouse: {
            husband: {title: 'husband', status: 'married', key: 'husband'},
            exHusband: {title: 'ex-husband', status: 'divorced', key: 'exHusband'},
            boyfriend: {title: 'boyfriend', status: 'together', key: 'boyfriend'},
            exBoyfriend: {title: 'ex-boyfriend', status: 'separated', key: 'exBoyfriend'},
            wife: {title: 'wife', status: 'married', key: 'wife'},
            exWife: {title: 'ex-wife', status: 'divorced', key: 'exWife'},
            girlfriend: {title: 'girlfriend', status: 'together', key: 'girlfriend'},
            exGirlfriend: {title: 'ex-girlfriend', status: 'separated', key: 'exGirlfriend'}
        }
    }

    addParent = function(person, relationshipToYou, relationshipToThem) {
        if (relationshipToYou.key in Person.relationships.parent && 
            relationshipToThem.key in Person.relationships.child) {
            this.relationships.parent[person.id] = {
                other: person,
                title: relationshipToYou.title, 
                method: relationshipToYou.method
            }
            person.relationships.child[this.id] = {
                other: this, 
                title: relationshipToThem.title, 
                method: relationshipToThem.method
            }
        }
        return this
    }
    addChild = function(person, relationshipToYou, relationshipToThem) {
        if (relationshipToYou.key in Person.relationships.child && 
            relationshipToThem.key in Person.relationships.parent) {
            this.relationships.child[person.id] = {
                other: person,
                title: relationshipToYou.title, 
                method: relationshipToYou.method
            }
            person.relationships.parent[this.id] = {
                other: this, 
                title: relationshipToThem.title, 
                method: relationshipToThem.method
            }
        }
        return this
    }
    addSpouse = function(person, relationshipToYou, relationshipToThem) {
        if (relationshipToYou.key in Person.relationships.spouse && 
            relationshipToThem.key in Person.relationships.spouse) {
            this.relationships.spouse[person.id] = {
                other: person,
                title: relationshipToYou.title, 
                status: relationshipToYou.status
            }
            person.relationships.spouse[this.id] = {
                other: this, 
                title: relationshipToThem.title, 
                status: relationshipToThem.status
            }
        }
        return this
    }

    getAllChildren = function(title=null, method=null) {
        var children = []

        for (let childID in this.relationships.child) {
            var child = Person.list[childID]
            var relationship = this.relationships.child[childID]
            if ((title == null || title.includes(relationship.title)) &&
                (method == null || method.includes(relationship.method))) {
                children.push({
                    'child': child,
                    'title': relationship.title,
                    'method': relationship.method
                })
            }
        }

        return children
    }

    getAllParents = function(title=null, method=null) {
        var parents = []

        for (let parentID in this.relationships.parent) {
            var parent = Person.list[parentID]
            var relationship = this.relationships.parent[parentID]
            if ((title == null || title.includes(relationship.title)) &&
                (method == null || method.includes(relationship.method))) {
                    parents.push({
                        'parent': parent,
                        'title': relationship.title,
                        'method': relationship.method
                    })
            }
        }

        return parents
    }

    getAllSpouses = function(title=null, status=null) {
        var spouses = []

        for (let spouseID in this.relationships.spouse) {
            var spouse = Person.list[spouseID]
            var relationship = this.relationships.spouse[spouseID]
            if ((title == null || title.includes(relationship.title)) &&
                (status == null || status.includes(relationship.status))) {
                    spouses.push({
                        'spouse': spouse,
                        'title': relationship.title,
                        'status': relationship.status
                    })
            }
        }

        return spouses
    }

    getAllSiblings = function(parentTitle=null, parentMethod=null, siblingTitle=null, siblingMethod=null) {
        var siblings = []
        var parents = this.getAllParents(parentTitle, parentMethod)
        for (let parent of parents.map(r => r.parent)) {
            var children = parent.getAllChildren(siblingTitle, siblingMethod)
            for (let sibling of children.map(r => r.child)) {
                if (!(siblings.includes(sibling)) && this != sibling) {
                    siblings.push(sibling)
                }
            }
        }

        return siblings
    }

    /* BIOLOGICAL gender */
    static genderes = {
        male: 1, 
        female: 0
    }

    addGender(gender) {
        if (gender in Person.genderes) {
            this.gender = gender
        }
        return this
    }

    /* NAMES */
    static formatName = function(name, format, cases) {
        if (!(format)) return ''
    
        let output = ''
        var temp = ''
        for (let i = 0; i < format.length; i++) {
            var char = format[i]
    
            if (char == '\\') {
                char = format[++i]
                switch (char) {
                    case '\\': break
                    case '[':
                        let x = format.substr(++i).indexOf(']')
                        let a = format.substr(i, x).split('|')
                        let passed = false
    
                        for (const [key, value] of Object.entries(cases)) {
                            if (key == a[0]) {
                                passed = Boolean(value)
                                break
                            }
                        }
    
                        output += Person.formatName(name, a[passed ? 1 : 2], cases)
                        char = format[i += ++x]
                        break
                }
            }
            
            for (const [key, value] of Object.entries(cases)) {
                if (char == key) {
                    output += value ? value : '-'
                    char = ''
                }
            }
            output += char
        }
        return output
    }

    static buildName = function(value, ...keys) {
        var name = {}
        value = value || null

        if (value == null) return {value: null}
        if (keys.length == 0) keys = ['value']
        if (value instanceof Array) {
            for (let i = 0; i < value.length && i < keys.length; i++) {
                const val = value[i];
                name[keys[i]] = value[i]
            }
        } else if (value.constructor == Object) {
            name = value
        } else {
            name[keys[0]] = value
        }
        return name
    }

    addEnglishName = function(last, first, middle, preferred=true) {
        let name = {
            first: Person.buildName(first, 'value', 'pronunciation'),
            middle: Person.buildName(middle, 'value', 'pronunciation'),
            last: Person.buildName(last, 'value', 'pronunciation'),
            language: 'en',
            display: function(format=null, get='value') {
                return Person.formatName(this, format || 'f\\[m| m|] l', {
                    'f': this.first[get],
                    'm': this.middle[get],
                    'l': this.last[get]
                })
            }
        }
        this.names.push(name)
        if (preferred) this.preferredName = name
        return this
    }
    
    addChineseName = function(family, given, preferred=true) {
        let name = {
            family: Person.buildName(family, 'value', 'pinyin'),
            given: Person.buildName(given, 'value', 'pinyin'),
            language: 'zh',
            display: function(format=null, get='value') {
                if (!(format)) {
                    if (get == 'value') format = 'fg'
                    else if (get == 'pinyin') format = 'f g'
                    else if (get == 'english') {
                        format = 'g f'
                        get = 'pinyin'
                    }
                }
                return Person.formatName(this, format, {
                    'f': this.family[get],
                    'g': this.given[get]
                })
            }
        }
        this.names.push(name)
        if (preferred) this.preferredName = name
        return this
    }
}
