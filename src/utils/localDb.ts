import { calculateLevel } from '@/data/pets'

// 接口类型定义
export interface User {
  id: string
  username: string
  passwordHash: string
  isGuest: boolean
  createdAt: number
}

export interface Class {
  id: string
  userId: string
  name: string
  createdAt: number
  updatedAt: number
}

export interface Student {
  id: string
  classId: string
  name: string
  studentNo?: string
  totalPoints: number
  petType?: string
  petLevel: number
  petExp: number
  createdAt: number
}

export interface Badge {
  id: string
  studentId: string
  petType: string
  earnedAt: number
}

export interface EvaluationRule {
  id: string
  name: string
  points: number
  category: string
  isCustom: boolean
  createdAt: number
}

export interface EvaluationRecord {
  id: string
  classId: string
  studentId: string
  points: number
  reason: string
  category: string
  timestamp: number
}

// 模拟数据库结构
interface LocalDbData {
  users: User[]
  classes: Class[]
  students: Student[]
  badges: Badge[]
  rules: EvaluationRule[]
  records: EvaluationRecord[]
  settings: Record<string, any>
}

const DB_KEY = 'class_pet_garden_local_db'

// 默认评价规则
const DEFAULT_RULES: Omit<EvaluationRule, 'id' | 'createdAt'>[] = [
  // 学习类 - 加分
  { name: '作业完成优秀', points: 1, category: '学习', isCustom: false },
  { name: '平时测验满分', points: 3, category: '学习', isCustom: false },
  { name: '平时测验达优秀', points: 2, category: '学习', isCustom: false },
  { name: '默写全对', points: 1, category: '学习', isCustom: false },
  { name: '订正态度认真', points: 1, category: '学习', isCustom: false },
  { name: '优秀作业,值得表扬', points: 1, category: '学习', isCustom: false },
  { name: '近期学习状态进步', points: 1, category: '学习', isCustom: false },
  { name: '被老师点名表扬', points: 1, category: '学习', isCustom: false },
  { name: '单元测验显著进步', points: 2, category: '学习', isCustom: false },
  // 学习类 - 扣分
  { name: '不交作业', points: -1, category: '学习', isCustom: false },
  { name: '未完成作业', points: -2, category: '学习', isCustom: false },
  { name: '作业潦草', points: -1, category: '学习', isCustom: false },
  { name: '订正不认真', points: -2, category: '学习', isCustom: false },
  { name: '抄袭作业', points: -5, category: '学习', isCustom: false },
  { name: '考试作弊', points: -5, category: '学习', isCustom: false },
  { name: '学习显著退步', points: -2, category: '学习', isCustom: false },
  // 行为类 - 加分
  { name: '早读认真专注', points: 1, category: '行为', isCustom: false },
  { name: '课前准备充分', points: 1, category: '行为', isCustom: false },
  { name: '眼保健操全程认真', points: 1, category: '行为', isCustom: false },
  { name: '升旗仪式安静整齐', points: 1, category: '行为', isCustom: false },
  { name: '守纪表现优秀(被表扬)', points: 2, category: '行为', isCustom: false },
  { name: '主动帮助同学', points: 2, category: '行为', isCustom: false },
  { name: '拾金不昧(一般物品)', points: 2, category: '行为', isCustom: false },
  { name: '拾金不昧(贵重物品)', points: 5, category: '行为', isCustom: false },
  { name: '主动帮助生病同学', points: 3, category: '行为', isCustom: false },
  { name: '主动调解同学矛盾、化解冲突', points: 3, category: '行为', isCustom: false },
  { name: '做好人好事被学校提出表扬', points: 3, category: '行为', isCustom: false },
  { name: '积极参与校内外志愿服务', points: 3, category: '行为', isCustom: false },
  { name: '犯错主动认错,积极协商', points: 1, category: '行为', isCustom: false },
  // 行为类 - 扣分
  { name: '无故迟到或早退', points: -1, category: '行为', isCustom: false },
  { name: '未佩戴红领巾,不穿校服', points: -1, category: '行为', isCustom: false },
  { name: '私自旷课或课间操', points: -3, category: '行为', isCustom: false },
  { name: '上课讲话、开小差', points: -1, category: '行为', isCustom: false },
  { name: '扰乱课堂', points: -3, category: '行为', isCustom: false },
  { name: '课间追逐打闹', points: -3, category: '行为', isCustom: false },
  { name: '追逐打闹(酿成事故)', points: -3, category: '行为', isCustom: false },
  { name: '中午自习说话、随意走动', points: -1, category: '行为', isCustom: false },
  { name: '私自带玩具或零食或危险物品', points: -3, category: '行为', isCustom: false },
  { name: '排队时说话或小动作不停,被点名', points: -1, category: '行为', isCustom: false },
  { name: '传播脏话或不良歌谣', points: -5, category: '行为', isCustom: false },
  { name: '撒谎、隐瞒真实情况', points: -2, category: '行为', isCustom: false },
  { name: '说脏话,骂人,起绰号', points: -2, category: '行为', isCustom: false },
  { name: '欺负、推搡、伤害同学', points: -10, category: '行为', isCustom: false },
  { name: '挑拨离间、拉帮结派', points: -3, category: '行为', isCustom: false },
  { name: '不尊重同学、孤立他人', points: -3, category: '行为', isCustom: false },
  { name: '为私欲包庇犯错者', points: -3, category: '行为', isCustom: false },
  { name: '恶意举报、诬陷他人', points: -3, category: '行为', isCustom: false },
  { name: '破坏校园设施', points: -5, category: '行为', isCustom: false },
  // 健康类 - 加分
  { name: '认真完成包干区值日', points: 1, category: '健康', isCustom: false },
  { name: '主动为班级擦黑板', points: 1, category: '健康', isCustom: false },
  { name: '主动整理讲台', points: 1, category: '健康', isCustom: false },
  { name: '主动整理黑板粉笔槽', points: 1, category: '健康', isCustom: false },
  { name: '主动倒垃圾并套垃圾袋', points: 2, category: '健康', isCustom: false },
  { name: '座位整洁无涂画,桌椅干净', points: 1, category: '健康', isCustom: false },
  { name: '座位周围无垃圾', points: 1, category: '健康', isCustom: false },
  // 健康类 - 扣分
  { name: '打扫包干区时间玩耍,不认真', points: -2, category: '健康', isCustom: false },
  { name: '个人座位卫生不合格', points: -1, category: '健康', isCustom: false },
  { name: '校园内乱扔垃圾', points: -1, category: '健康', isCustom: false },
  { name: '桌洞脏乱、物品杂乱', points: -1, category: '健康', isCustom: false },
  { name: '破坏卫生、乱涂乱画', points: -2, category: '健康', isCustom: false },
  { name: '浪费粮食', points: -2, category: '健康', isCustom: false },
  { name: '破坏班级绿植、把玩绿植', points: -3, category: '健康', isCustom: false },
  // 其他类 - 加分
  { name: '主动整理图书、摆放整齐', points: 2, category: '其他', isCustom: false },
  { name: '主动帮同学更换桌椅', points: 2, category: '其他', isCustom: false },
  { name: '主动承担班级任务', points: 2, category: '其他', isCustom: false },
  { name: '积极参加班级墙面布置', points: 2, category: '其他', isCustom: false },
  { name: '积极参加班级或学校活动', points: 1, category: '其他', isCustom: false },
  { name: '活动中表现优秀', points: 2, category: '其他', isCustom: false },
  { name: '代表班级参赛', points: 3, category: '其他', isCustom: false },
  { name: '校级比赛:一等奖', points: 5, category: '其他', isCustom: false },
  { name: '校级比赛:二等奖', points: 4, category: '其他', isCustom: false },
  { name: '校级比赛:三等奖', points: 3, category: '其他', isCustom: false },
  { name: '区级及以上:一等奖', points: 8, category: '其他', isCustom: false },
  { name: '区级及以上:二等奖', points: 6, category: '其他', isCustom: false },
  { name: '区级及以上:三等奖', points: 4, category: '其他', isCustom: false },
  { name: '联欢会或文艺汇演积极参与', points: 2, category: '其他', isCustom: false },
  { name: '为班级争得荣誉', points: 5, category: '其他', isCustom: false },
  { name: '小组全周无违纪、全员交作业', points: 2, category: '其他', isCustom: false },
  // 其他类 - 扣分
  { name: '损坏公物、乱刻乱画', points: -1, category: '其他', isCustom: false },
  { name: '浪费水电、屡教不改', points: -1, category: '其他', isCustom: false },
  { name: '故意玩弄损坏公共电器', points: -3, category: '其他', isCustom: false },
  { name: '故意损坏卫生工具', points: -2, category: '其他', isCustom: false },
  { name: '扣分严重/打架/作弊/严重违纪', points: -8, category: '其他', isCustom: false },
]

// 简单 UUID 生成器（浏览器环境）
function uuid(): string {
  return 'local_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36)
}

// 初始化数据库
function getDbData(): LocalDbData {
  const data = localStorage.getItem(DB_KEY)
  if (data) {
    try {
      const parsed = JSON.parse(data)
      // 兼容性补充字段
      if (!parsed.users) parsed.users = []
      if (!parsed.classes) parsed.classes = []
      if (!parsed.students) parsed.students = []
      if (!parsed.badges) parsed.badges = []
      if (!parsed.rules) parsed.rules = []
      if (!parsed.records) parsed.records = []
      if (!parsed.settings) parsed.settings = {}
      return parsed
    } catch {
      // 解析失败则清空并重建
    }
  }

  // 默认初始数据
  const initialRules: EvaluationRule[] = DEFAULT_RULES.map((r, i) => ({
    id: `rule_local_${i}`,
    name: r.name,
    points: r.points,
    category: r.category,
    isCustom: r.isCustom,
    createdAt: Date.now()
  }))

  const initialSettings = {
    levelConfig: [40, 60, 80, 100, 120, 140, 160]
  }

  const defaultDb: LocalDbData = {
    users: [
      {
        id: 'guest',
        username: 'guest',
        passwordHash: '',
        isGuest: true,
        createdAt: Date.now()
      }
    ],
    classes: [],
    students: [],
    badges: [],
    rules: initialRules,
    records: [],
    settings: initialSettings
  }

  localStorage.setItem(DB_KEY, JSON.stringify(defaultDb))
  return defaultDb
}

function saveDbData(data: LocalDbData) {
  localStorage.setItem(DB_KEY, JSON.stringify(data))
}

// 核心业务处理方法
export const localDb = {
  // 获取当前登录用户
  getUserByToken(token: string): User | null {
    const db = getDbData()
    if (token === 'guest') {
      return db.users.find(u => u.username === 'guest') || null
    }
    if (token.startsWith('mock-token-')) {
      const userId = token.replace('mock-token-', '')
      return db.users.find(u => u.id === userId) || null
    }
    return null
  },

  // 登录
  login(username: string, passwordHash: string): { user: User; token: string } | null {
    const db = getDbData()
    const user = db.users.find(u => u.username === username)
    if (!user) return null
    // 本地极简测试，如果密码一致或未注册直接通过（这里直接比对密码哈希即可）
    if (user.passwordHash !== passwordHash) return null

    return {
      user,
      token: `mock-token-${user.id}`
    }
  },

  // 注册
  register(username: string, passwordHash: string): User | null {
    const db = getDbData()
    const exists = db.users.some(u => u.username === username)
    if (exists) return null

    const newUser: User = {
      id: uuid(),
      username,
      passwordHash,
      isGuest: false,
      createdAt: Date.now()
    }
    db.users.push(newUser)
    saveDbData(db)
    return newUser
  },

  // 获取班级列表
  getClasses(userId: string): Class[] {
    const db = getDbData()
    return db.classes.filter(c => c.userId === userId)
  },

  // 创建班级
  createClass(userId: string, name: string): Class {
    const db = getDbData()
    const newClass: Class = {
      id: uuid(),
      userId,
      name,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    db.classes.push(newClass)
    saveDbData(db)
    return newClass
  },

  // 修改班级
  updateClass(userId: string, classId: string, name: string): Class | null {
    const db = getDbData()
    const cls = db.classes.find(c => c.id === classId && c.userId === userId)
    if (!cls) return null
    cls.name = name
    cls.updatedAt = Date.now()
    saveDbData(db)
    return cls
  },

  // 删除班级
  deleteClass(userId: string, classId: string): boolean {
    const db = getDbData()
    const index = db.classes.findIndex(c => c.id === classId && c.userId === userId)
    if (index === -1) return false

    db.classes.splice(index, 1)
    // 级联删除班级下的学生、评价记录
    db.students = db.students.filter(s => s.classId !== classId)
    db.records = db.records.filter(r => r.classId !== classId)
    saveDbData(db)
    return true
  },

  // 获取班级学生
  getStudentsByClass(classId: string): Student[] {
    const db = getDbData()
    return db.students.filter(s => s.classId === classId)
  },

  // 创建学生
  createStudent(classId: string, name: string, studentNo?: string, petType?: string): Student {
    const db = getDbData()
    const newStudent: Student = {
      id: uuid(),
      classId,
      name,
      studentNo,
      totalPoints: 0,
      petType: petType || undefined,
      petLevel: 1,
      petExp: 0,
      createdAt: Date.now()
    }
    db.students.push(newStudent)
    saveDbData(db)
    return newStudent
  },

  // 删除学生
  deleteStudent(studentId: string): boolean {
    const db = getDbData()
    const index = db.students.findIndex(s => s.id === studentId)
    if (index === -1) return false

    db.students.splice(index, 1)
    db.records = db.records.filter(r => r.studentId !== studentId)
    db.badges = db.badges.filter(b => b.studentId !== studentId)
    saveDbData(db)
    return true
  },

  // 选择/更换宠物
  updateStudentPet(studentId: string, petType: string): Student | null {
    const db = getDbData()
    const student = db.students.find(s => s.id === studentId)
    if (!student) return null

    student.petType = petType
    student.petLevel = 1
    student.petExp = 0
    student.totalPoints = 0 // 换宠物重置分数
    saveDbData(db)
    return student
  },

  // 批量导入学生
  importStudents(classId: string, list: { name: string; studentNo?: string }[]): Student[] {
    const db = getDbData()
    const created: Student[] = []
    for (const item of list) {
      const newStudent: Student = {
        id: uuid(),
        classId,
        name: item.name,
        studentNo: item.studentNo,
        totalPoints: 0,
        petLevel: 1,
        petExp: 0,
        createdAt: Date.now()
      }
      db.students.push(newStudent)
      created.push(newStudent)
    }
    saveDbData(db)
    return created
  },

  // 获取规则列表
  getRules(): EvaluationRule[] {
    const db = getDbData()
    return db.rules
  },

  // 添加自定义规则
  createRule(name: string, points: number, category: string): EvaluationRule {
    const db = getDbData()
    const newRule: EvaluationRule = {
      id: uuid(),
      name,
      points,
      category,
      isCustom: true,
      createdAt: Date.now()
    }
    db.rules.push(newRule)
    saveDbData(db)
    return newRule
  },

  // 删除自定义规则
  deleteRule(ruleId: string): boolean {
    const db = getDbData()
    const index = db.rules.findIndex(r => r.id === ruleId)
    if (index === -1) return false
    db.rules.splice(index, 1)
    saveDbData(db)
    return true
  },

  // 添加评价记录（含加减分、等级计算、徽章发放等核心业务）
  addEvaluation(classId: string, studentIds: string[], points: number, reason: string, category: string) {
    const db = getDbData()
    const now = Date.now()
    const results: any[] = []

    for (const studentId of studentIds) {
      const student = db.students.find(s => s.id === studentId)
      if (!student) continue

      const recordId = uuid()
      // 1. 插入记录
      const newRecord: EvaluationRecord = {
        id: recordId,
        classId,
        studentId,
        points,
        reason,
        category,
        timestamp: now
      }
      db.records.push(newRecord)

      // 2. 更新学生分数与经验
      student.totalPoints += points

      let levelUp = false
      let levelDown = false
      let graduated = false
      let newLevel = student.petLevel
      let newExp = student.petExp

      if (student.petType) {
        newExp = Math.max(0, student.totalPoints)
        newLevel = calculateLevel(newExp)

        if (newLevel > student.petLevel) {
          levelUp = true
          // 检查是否毕业（达到 Lv.8 毕业）
          if (newLevel === 8 && student.petLevel < 8) {
            const badgeId = uuid()
            const newBadge: Badge = {
              id: badgeId,
              studentId,
              petType: student.petType,
              earnedAt: now
            }
            db.badges.push(newBadge)
            graduated = true
          }
        } else if (newLevel < student.petLevel) {
          levelDown = true
        }

        student.petExp = newExp
        student.petLevel = newLevel
      }

      results.push({
        id: recordId,
        studentId,
        studentName: student.name,
        timestamp: now,
        petLevel: newLevel,
        petExp: newExp,
        levelUp,
        levelDown,
        graduated
      })
    }

    saveDbData(db)
    // 保持与后端单个接口或批量接口结构一致
    return results.length === 1 ? results[0] : { success: true, results }
  },

  // 获取评价记录列表
  getEvaluations(filters: { classId?: string; studentId?: string; page: number; pageSize: number }) {
    const db = getDbData()
    let filtered = db.records.slice()

    if (filters.classId) {
      filtered = filtered.filter(r => r.classId === filters.classId)
    }
    if (filters.studentId) {
      filtered = filtered.filter(r => r.studentId === filters.studentId)
    }

    // 按时间降序
    filtered.sort((a, b) => b.timestamp - a.timestamp)

    const total = filtered.length
    const offset = (filters.page - 1) * filters.pageSize
    const paginated = filtered.slice(offset, offset + filters.pageSize)

    // 拼装学生姓名
    const records = paginated.map(r => {
      const student = db.students.find(s => s.id === r.studentId)
      return {
        ...r,
        student_name: student ? student.name : '未知学生'
      }
    })

    return {
      records,
      total,
      page: filters.page,
      pageSize: filters.pageSize,
      totalPages: Math.ceil(total / filters.pageSize)
    }
  },

  // 撤回班级最近一条评价
  undoLatestEvaluation(classId: string): any {
    const db = getDbData()
    // 获取最新的一条记录
    const classRecords = db.records.filter(r => r.classId === classId)
    if (classRecords.length === 0) return null

    classRecords.sort((a, b) => b.timestamp - a.timestamp)
    const latest = classRecords[0]

    // 移除记录
    db.records = db.records.filter(r => r.id !== latest.id)

    // 恢复学生状态
    const student = db.students.find(s => s.id === latest.studentId)
    if (student) {
      student.totalPoints -= latest.points
      if (student.petType) {
        student.petExp = Math.max(0, student.totalPoints)
        student.petLevel = calculateLevel(student.petExp)
        // 如果原本是满级，现在退回了，可以不主动删去徽章，或者退回徽章。通常我们和后端一样：重新计算等级。
        // better-sqlite3 撤销时没有显式删徽章，我们也简单更新积分与等级
      }
    }

    saveDbData(db)
    return latest
  },

  // 删除单条评价记录
  deleteEvaluation(recordId: string): any {
    const db = getDbData()
    const index = db.records.findIndex(r => r.id === recordId)
    if (index === -1) return null

    const record = db.records[index]
    db.records.splice(index, 1)

    // 恢复学生状态
    const student = db.students.find(s => s.id === record.studentId)
    if (student) {
      student.totalPoints -= record.points
      if (student.petType) {
        student.petExp = Math.max(0, student.totalPoints)
        student.petLevel = calculateLevel(student.petExp)
      }
    }

    saveDbData(db)
    return record
  },

  // 导出备份数据
  backup(): any {
    const db = getDbData()
    return db
  },

  // 还原备份数据
  restore(data: any): boolean {
    if (!data || typeof data !== 'object') return false
    // 对结构做基础验证
    const restored: LocalDbData = {
      users: Array.isArray(data.users) ? data.users : [],
      classes: Array.isArray(data.classes) ? data.classes : [],
      students: Array.isArray(data.students) ? data.students : [],
      badges: Array.isArray(data.badges) ? data.badges : [],
      rules: Array.isArray(data.rules) ? data.rules : [],
      records: Array.isArray(data.records) ? data.records : [],
      settings: (data.settings && typeof data.settings === 'object') ? data.settings : { levelConfig: [40, 60, 80, 100, 120, 140, 160] }
    }

    saveDbData(restored)
    return true
  },

  // 获取设置项
  getSettings(): any {
    const db = getDbData()
    return db.settings
  },

  // 修复经验值（将 pet_exp 与 total_points 同步）
  fixExp(userId: string): number {
    const db = getDbData()
    // 获取当前用户的所有班级
    const classIds = db.classes.filter(c => c.userId === userId).map(c => c.id)
    let changes = 0

    for (const student of db.students) {
      if (classIds.includes(student.classId) && student.petType) {
        const expectedExp = Math.max(0, student.totalPoints)
        if (student.petExp !== expectedExp) {
          student.petExp = expectedExp
          student.petLevel = calculateLevel(expectedExp)
          changes++
        }
      }
    }

    if (changes > 0) {
      saveDbData(db)
    }
    return changes
  },

  // 获取排行榜
  getRanking(classId: string): any[] {
    const db = getDbData()
    const classStudents = db.students.filter(s => s.classId === classId)

    const ranking = classStudents.map(s => {
      const badgeCount = db.badges.filter(b => b.studentId === s.id).length
      return {
        id: s.id,
        class_id: s.classId,
        name: s.name,
        student_no: s.studentNo,
        total_points: s.totalPoints,
        pet_type: s.petType,
        pet_level: s.petLevel,
        pet_exp: s.petExp,
        created_at: s.createdAt,
        badge_count: badgeCount
      }
    })

    // 排序逻辑：积分降序，等级降序
    ranking.sort((a, b) => {
      if (b.total_points !== a.total_points) {
        return b.total_points - a.total_points
      }
      return b.pet_level - a.pet_level
    })

    return ranking
  }
}
