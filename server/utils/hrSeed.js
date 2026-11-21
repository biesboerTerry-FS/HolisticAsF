// Idempotent, one-time seeding for the HR demo suite. Called from the HR API
// on first use so a fresh deployment has realistic data without a manual seed.
import Employee from "../models/Employee.js";
import PayRun from "../models/PayRun.js";
import PerformanceNote from "../models/PerformanceNote.js";
import TimeOffRequest from "../models/TimeOffRequest.js";
import HrSetting from "../models/HrSetting.js";
import {
	buildPayRuns,
	buildPerformanceNotes,
	buildTimeOffRequests,
	HR_DEPARTMENTS,
	HR_EMPLOYEES,
	HR_ROLES,
} from "../seeds/hrData.js";

const SEED_KEY = "hr-seed-v1";
const CATALOG_KEY = "catalog";
let seedPromise = null;

const seedOnce = async () => {
	const marker = await HrSetting.findOne({ key: SEED_KEY }).lean();
	if (marker) return;

	const byEmployeeId = {};
	for (const data of HR_EMPLOYEES) {
		const employee = await Employee.findOneAndUpdate(
			{ employeeId: data.employeeId },
			{ $set: data },
			{ upsert: true, new: true, setDefaultsOnInsert: true },
		);
		byEmployeeId[data.employeeId] = employee;
	}

	for (const run of buildPayRuns()) {
		await PayRun.updateOne(
			{ key: run.key },
			{
				$set: {
					...run,
					employee: byEmployeeId[run.employeeId]?._id || null,
				},
			},
			{ upsert: true, setDefaultsOnInsert: true },
		);
	}

	for (const note of buildPerformanceNotes()) {
		await PerformanceNote.updateOne(
			{ key: note.key },
			{
				$set: {
					...note,
					employee: byEmployeeId[note.employeeId]?._id || null,
				},
			},
			{ upsert: true, setDefaultsOnInsert: true },
		);
	}

	for (const request of buildTimeOffRequests()) {
		await TimeOffRequest.updateOne(
			{ requestId: request.requestId },
			{ $setOnInsert: request },
			{ upsert: true, setDefaultsOnInsert: true },
		);
	}

	await HrSetting.updateOne(
		{ key: CATALOG_KEY },
		{ $setOnInsert: { departments: HR_DEPARTMENTS, roles: HR_ROLES } },
		{ upsert: true, setDefaultsOnInsert: true },
	);

	await HrSetting.updateOne(
		{ key: SEED_KEY },
		{ $set: { departments: [], roles: [] } },
		{ upsert: true, setDefaultsOnInsert: true },
	);
};

export const ensureHrSeed = async () => {
	if (!seedPromise) {
		seedPromise = seedOnce().catch((error) => {
			// Allow a retry if the first attempt failed (e.g. cold DB connection).
			seedPromise = null;
			throw error;
		});
	}
	return seedPromise;
};

export default ensureHrSeed;
